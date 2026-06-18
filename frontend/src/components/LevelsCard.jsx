import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function Bar({ label, value, max, unit, barColor }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value != null ? Math.min(value / max * 100, 100) : 0), 120);
    return () => clearTimeout(t);
  }, [value, max]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-navy-500 dark:text-lightblue min-w-[64px]">{label}</span>
      <div className="flex-1 progress-bar">
        <div className="progress-fill" style={{ width: `${width}%`, background: barColor }} />
      </div>
      <span className="text-sm font-bold text-navy-900 dark:text-white min-w-[60px] text-right tabular-nums">
        {value != null ? `${value.toFixed(2)} ${unit}` : '–'}
      </span>
    </div>
  );
}

export function FlowChart({ readings, height = 150 }) {
  const { t } = useTranslation();
  const data = readings?.length
    ? readings.map(r => ({ t: +(r.t / 1000).toFixed(2), v: +r.v.toFixed(3) }))
    : [];
  if (data.length < 2) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-navy-500 dark:text-lightblue mb-2">{t('flow_chart_title')}</p>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 2 }}>
          <defs>
            <linearGradient id="flowFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#185FA5" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#185FA5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(4,44,83,0.08)" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#94A3B8' }}
            label={{ value: t('flow_x'), position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94A3B8' }} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }}
            formatter={(v) => [`${v} L`, t('flow_y')]}
            labelFormatter={(l) => `${l}s`}
          />
          <Area type="monotone" dataKey="v" stroke="#185FA5" strokeWidth={2.5}
            fill="url(#flowFill)" isAnimationActive animationDuration={900} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function LevelsCard({ fev1, fvc, ratio, readings, calibrated, onTest, onCalibrate, connected }) {
  const { t } = useTranslation();

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy-900 dark:text-white">{t('levels_title')}</h2>
        {!calibrated && fev1 != null && (
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-full px-2 py-0.5">
            {t('uncalibrated')}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Bar label={t('fev1')}  value={fev1}  max={6}   unit="L" barColor="#185FA5" />
        <Bar label={t('fvc')}   value={fvc}   max={6}   unit="L" barColor="#2A6DC0" />
        <Bar label={t('ratio')} value={ratio} max={100} unit="%"
          barColor={ratio != null ? (ratio >= 70 ? '#059669' : ratio >= 60 ? '#D97706' : '#DC2626') : '#185FA5'} />
      </div>

      <FlowChart readings={readings} />

      <div className="flex gap-2 mt-auto pt-1">
        <button onClick={onTest} disabled={!connected}
          className="flex-1 btn-primary py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
          {t('test_btn')}
        </button>
        <button onClick={onCalibrate} disabled={!connected}
          className="btn-secondary text-xs px-4 disabled:opacity-40 disabled:cursor-not-allowed">
          {t('calibrate_btn')}
        </button>
      </div>
    </div>
  );
}
