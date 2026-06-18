import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from '@phosphor-icons/react';

export default function CalibrationModal({ open, onClose, onCalibrated, captureWindow }) {
  const { t } = useTranslation();
  const [knownVol, setKnownVol] = useState('3.0');
  const [phase, setPhase] = useState('idle'); // idle | blowing | done
  const [factor, setFactor] = useState(null);

  async function startCal() {
    const vol = parseFloat(knownVol);
    if (isNaN(vol) || vol <= 0) return;
    setPhase('blowing');
    const rawMin = await captureWindow(4000, 'min');
    const rawMax = await captureWindow(500, 'max');
    const height = Math.max(0, rawMax - rawMin);
    // Compute raw volume from current formula, find correction factor
    const MAX_TUBE_HEIGHT = 16;
    const rawVol = Math.min(height / MAX_TUBE_HEIGHT, 1.0) * 5.0;
    const f = rawVol > 0 ? +(vol / rawVol).toFixed(4) : 1.0;
    localStorage.setItem('bb-cal-factor', String(f));
    setFactor(f);
    setPhase('done');
    onCalibrated(f);
  }

  function handleClose() {
    setPhase('idle');
    setFactor(null);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f2137] rounded-2xl shadow-2xl p-8 flex flex-col gap-5 w-full max-w-sm mx-4">
        <h3 className="text-xl font-bold text-navy-900 dark:text-white">{t('cal_title')}</h3>
        <p className="text-sm text-navy-500 dark:text-lightblue">{t('cal_intro')}</p>

        {phase === 'idle' && (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-navy-600 dark:text-lightblue">{t('cal_volume_label')}</span>
              <input
                type="number" step="0.1" min="0.5" max="6"
                value={knownVol}
                onChange={e => setKnownVol(e.target.value)}
                className="input-field"
              />
            </label>
            <button onClick={startCal} className="btn-primary py-3">{t('cal_start')}</button>
          </>
        )}

        {phase === 'blowing' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy-400 to-navy-600 animate-breathe-fast" />
            <p className="text-sm font-semibold text-navy-700 dark:text-lightblue text-center">{t('cal_blow')}</p>
          </div>
        )}

        {phase === 'done' && (
          <div className="flex flex-col items-center gap-3 py-2">
            <CheckCircle size={44} weight="fill" className="text-emerald-500" />
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{t('cal_done')}</p>
            <p className="text-sm text-navy-500 dark:text-lightblue">
              {t('cal_factor')}: <strong>{factor}</strong>
            </p>
          </div>
        )}

        <button onClick={handleClose} className="btn-secondary text-sm mt-1">{t('close')}</button>
      </div>
    </div>
  );
}
