import { useState, useRef, useCallback } from 'react';

const TUBE_RADIUS_CM  = 0.75;
const MAX_TUBE_HEIGHT = 16;

export function scaledFVC(h) {
  return +(Math.min(h / MAX_TUBE_HEIGHT, 1.0) * 5.0).toFixed(2);
}

export function useSerial({ onLine, onDisconnect }) {
  const [connected, setConnected]   = useState(false);
  const [portLabel, setPortLabel]   = useState('');
  const [liveReading, setLiveReading] = useState(null);
  const [supported] = useState(() => 'serial' in navigator);

  const portRef       = useRef(null);
  const readerRef     = useRef(null);
  const lastAccepted  = useRef(null);
  const smoothBuf     = useRef([]);

  const dbg = (msg) => console.log('[BB Serial]', msg);

  function filterReading(num) {
    if (lastAccepted.current === null || Math.abs(num - lastAccepted.current) < 10) {
      lastAccepted.current = num;
      return true;
    }
    dbg('Spike filtered: ' + num);
    return false;
  }

  function smoothReading(num) {
    smoothBuf.current.push(num);
    if (smoothBuf.current.length > 3) smoothBuf.current.shift();
    const avg = smoothBuf.current.reduce((a, b) => a + b, 0) / smoothBuf.current.length;
    return +avg.toFixed(2);
  }

  async function startReading(port) {
    dbg('Starting read loop…');
    await new Promise(r => setTimeout(r, 2000)); // let Arduino boot
    dbg('Reading bytes…');
    let buffer = '';
    try {
      const reader = port.readable.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) { dbg('Reader done.'); break; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const raw of lines) {
          const t = raw.trim();
          if (!t) continue;
          const match = t.match(/[-+]?[0-9]*\.?[0-9]+/);
          if (!match) continue;
          const num = parseFloat(match[0]);
          if (isNaN(num)) continue;
          if (!filterReading(num)) continue;
          const smoothed = smoothReading(num);
          setLiveReading(smoothed);
          onLine?.(smoothed);
        }
      }
    } catch (e) {
      dbg('Read error: ' + e.message);
      setConnected(false);
      portRef.current = null;
      onDisconnect?.();
    } finally {
      try { readerRef.current?.releaseLock(); readerRef.current = null; } catch (_) {}
    }
  }

  const connect = useCallback(async () => {
    if (!supported) return { error: 'unsupported' };

    if (portRef.current) {
      try {
        if (readerRef.current) { await readerRef.current.cancel(); readerRef.current = null; }
        await portRef.current.close();
      } catch (_) {}
      portRef.current = null;
      setConnected(false);
      setPortLabel('');
      setLiveReading(null);
      lastAccepted.current = null;
      smoothBuf.current = [];
      return { disconnected: true };
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      const info = port.getInfo();
      portRef.current = port;
      setConnected(true);
      setPortLabel(`VID: ${info.usbVendorId ?? '—'} PID: ${info.usbProductId ?? '—'}`);
      startReading(port);
      return { ok: true };
    } catch (e) {
      portRef.current = null;
      if (e.name === 'NotFoundError') return { cancelled: true };
      return { error: e.message };
    }
  }, [supported]);

  return { connected, portLabel, liveReading, supported, connect };
}
