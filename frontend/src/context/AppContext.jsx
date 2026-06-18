import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSerial, scaledFVC } from '../hooks/useSerial';
import { getResults, saveResult } from '../lib/api';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

export function AppProvider({ children }) {
  const { user, loading: authLoading, login, signOut } = useAuth();

  // ── Serial capture refs (shared) ──
  const captureRef  = useRef({ active: false, readings: [], startTime: null });
  const lastLineRef = useRef(null);
  const [disconnected, setDisconnected] = useState(false);

  const serial = useSerial({
    onLine: (cm) => {
      lastLineRef.current = cm;
      if (captureRef.current.active) {
        const elapsed = Date.now() - captureRef.current.startTime;
        captureRef.current.readings.push({ t: elapsed, raw: cm });
      }
    },
    onDisconnect: () => setDisconnected(true),
  });

  // ── Test + result state ──
  const [status,   setStatus]   = useState(null);
  const [fev1,     setFev1]     = useState(null);
  const [fvc,      setFvc]      = useState(null);
  const [ratio,    setRatio]    = useState(null);
  const [readings, setReadings] = useState([]);
  const [results,  setResults]  = useState([]);
  const [resLoading, setResLoading] = useState(true);
  const [testOpen, setTestOpen] = useState(false);
  const [testStep, setTestStep] = useState({ title: '', msg: '', progress: 0 });
  const [calFactor, setCalFactor] = useState(() => parseFloat(localStorage.getItem('bb-cal-factor') || '1'));
  const [savedFlash, setSavedFlash] = useState(false);
  const [connectError, setConnectError] = useState('');

  // Load history once user is known
  useEffect(() => {
    if (!user) { setResults([]); setResLoading(false); return; }
    setResLoading(true);
    getResults().then(setResults).catch(() => {}).finally(() => setResLoading(false));
  }, [user]);

  // ════════════════════════════════════════════════════
  //  MEASUREMENT  — built by Ryan, preserved untouched
  // ════════════════════════════════════════════════════
  const captureWindow = useCallback((ms, mode) => {
    captureRef.current = { active: true, readings: [], startTime: Date.now() };
    return wait(ms).then(() => {
      captureRef.current.active = false;
      const raws = captureRef.current.readings.map(r => r.raw);
      if (!raws.length) return lastLineRef.current ?? 20;
      if (mode === 'min') return Math.min(...raws);
      if (mode === 'max') return Math.max(...raws);
      return raws.reduce((a, b) => a + b, 0) / raws.length;
    });
  }, []);

  const captureTimestamped = useCallback((ms, baseline) => {
    captureRef.current = { active: true, readings: [], startTime: Date.now() };
    return wait(ms).then(() => {
      captureRef.current.active = false;
      return captureRef.current.readings.map(r => ({
        t: r.t,
        v: +(scaledFVC(Math.max(0, baseline - r.raw)) * calFactor).toFixed(3),
      }));
    });
  }, [calFactor]);

  const setStep = (title, msg, progress) => setTestStep({ title, msg, progress });

  const startTest = useCallback(async (t) => {
    if (!serial.connected) { alert(t('connect_first')); return; }
    setTestOpen(true);
    setDisconnected(false);

    setStep(t('step_baseline'), t('step_baseline_msg'), 15);
    const baseline = await captureWindow(2500, 'max');

    setStep(t('step_exhale'), t('step_exhale_msg'), 42);
    const timedReadings = await captureTimestamped(5000, baseline);

    const allVols = timedReadings.map(r => r.v);
    const fvcRaw  = allVols.length ? Math.max(...allVols) : 0;

    const fev1Readings = timedReadings.filter(r => r.t <= 1000);
    const fev1Vols = fev1Readings.map(r => r.v);
    const fev1Raw  = fev1Vols.length ? Math.max(...fev1Vols) : fvcRaw * 0.8;

    setStep(t('step_calculating'), t('step_calculating_msg'), 90);
    await wait(600);

    const fvcFinal  = +Math.min(fvcRaw, 5.0).toFixed(2);
    const fev1Final = +Math.min(fev1Raw, fvcFinal).toFixed(2);
    const ratioFinal = fvcFinal > 0 ? +(fev1Final / fvcFinal * 100).toFixed(1) : 0;
    const statusStr = ratioFinal >= 70 ? 'Normal' : ratioFinal >= 60 ? 'Borderline' : 'Low';

    setStep(t('step_complete'), t('step_complete_msg'), 100);
    await wait(700);
    setTestOpen(false);

    setFev1(fev1Final);
    setFvc(fvcFinal);
    setRatio(ratioFinal);
    setStatus(statusStr);
    setReadings(timedReadings);

    try {
      const saved = await saveResult({
        fev1: fev1Final, fvc: fvcFinal, ratio: ratioFinal, status: statusStr,
        readings: timedReadings, calibration_factor: calFactor,
      });
      setResults(prev => [saved, ...prev]);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 3000);
    } catch (e) {
      console.error('Save failed:', e.message);
    }
  }, [serial.connected, captureWindow, captureTimestamped, calFactor]);

  // ── Connect ──
  const handleConnect = useCallback(async (t) => {
    setConnectError('');
    setDisconnected(false);
    if (!serial.supported) { setConnectError(t('serial_unsupported')); return; }
    const result = await serial.connect();
    if (result?.error) setConnectError(result.error);
  }, [serial]);

  const value = {
    // auth
    user, authLoading, login, signOut,
    // serial
    ...serial, disconnected, connectError, handleConnect,
    // test/results
    status, fev1, fvc, ratio, readings, results, resLoading,
    testOpen, testStep, savedFlash,
    calFactor, setCalFactor,
    startTest, captureWindow,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
