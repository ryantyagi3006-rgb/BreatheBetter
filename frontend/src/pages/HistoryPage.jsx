import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Wind, DownloadSimple, ArrowRight } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import { FlowChart } from '../components/LevelsCard';

function statusColor(s) {
  if (s === 'Normal')     return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
  if (s === 'Borderline') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
  return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
}

function exportCSV(results) {
  const header = 'Date,FEV1 (L),FVC (L),FEV1/FVC (%),Status';
  const rows = results.map(r => [
    new Date(r.created_at).toLocaleString(),
    r.fev1?.toFixed(2), r.fvc?.toFixed(2), r.ratio?.toFixed(1), r.status,
  ].join(','));
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'breathebetter-results.csv'; a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, unit }) {
  return (
    <div className="card text-center py-5">
      <p className="text-3xl font-black text-navy-900 dark:text-white tabular-nums">{value ?? '–'}<span className="text-base font-bold text-navy-400">{unit}</span></p>
      <p className="text-xs text-navy-500 dark:text-lightblue mt-1">{label}</p>
    </div>
  );
}

export default function HistoryPage() {
  const { t } = useTranslation();
  const { results, resLoading } = useApp();
  const [selected, setSelected] = useState(null);

  // Trend data (chronological)
  const trend = [...results].reverse().map((r, i) => ({
    n: i + 1,
    fev1: r.fev1,
    fvc: r.fvc,
    ratio: r.ratio,
    date: new Date(r.created_at).toLocaleDateString(),
  }));

  const latest = results[0];
  const avgRatio = results.length
    ? +(results.reduce((a, r) => a + (r.ratio || 0), 0) / results.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white">{t('history_title')}</h1>
          <p className="text-sm text-navy-500 dark:text-lightblue">{t('history_page_sub')}</p>
        </div>
        {results.length > 0 && (
          <button onClick={() => exportCSV(results)} className="btn-secondary text-sm px-4 py-2.5 inline-flex items-center gap-2">
            <DownloadSimple size={16} weight="bold" /> {t('export_csv')}
          </button>
        )}
      </div>

      {resLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-4 border-navy-200 border-t-navy-600 animate-spin" /></div>
      ) : !results.length ? (
        <div className="card text-center py-16 flex flex-col items-center gap-4">
          <Wind size={44} weight="light" className="text-navy-400 dark:text-lightblue" />
          <p className="text-navy-500 dark:text-lightblue">{t('history_empty')}</p>
          <Link to="/dashboard" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
            {t('run_first_test')} <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-fade-up">
            <StatCard label={t('total_tests')} value={results.length} unit="" />
            <StatCard label={t('latest_ratio')} value={latest?.ratio} unit="%" />
            <StatCard label={t('avg_ratio')} value={avgRatio} unit="%" />
            <StatCard label={t('latest_fvc')} value={latest?.fvc?.toFixed(2)} unit="L" />
          </div>

          {/* Trend chart */}
          {trend.length > 1 && (
            <div className="card mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-4">{t('trend_title')}</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trend} margin={{ top: 6, right: 10, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(4,44,83,0.08)" />
                  <XAxis dataKey="n" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="fev1" name="FEV1 (L)" stroke="#185FA5" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="fvc" name="FVC (L)" stroke="#2A6DC0" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ratio" name="Ratio (%)" stroke="#059669" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          <div className="card animate-fade-up" style={{ animationDelay: '120ms' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 dark:border-white/10">
                    {[t('col_date'), t('col_fev1'), t('col_fvc'), t('col_ratio'), t('col_status'), ''].map((h, i) => (
                      <th key={i} className="text-left text-xs font-semibold text-navy-400 dark:text-lightblue py-2 pr-4 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id} className="border-b border-navy-50 dark:border-white/5 hover:bg-navy-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 pr-4 text-navy-600 dark:text-lightblue whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="py-2.5 pr-4 font-semibold text-navy-900 dark:text-white tabular-nums">{r.fev1?.toFixed(2)}</td>
                      <td className="py-2.5 pr-4 font-semibold text-navy-900 dark:text-white tabular-nums">{r.fvc?.toFixed(2)}</td>
                      <td className="py-2.5 pr-4 font-semibold text-navy-900 dark:text-white tabular-nums">{r.ratio?.toFixed(1)}%</td>
                      <td className="py-2.5 pr-4"><span className={`text-xs font-bold rounded-full px-2.5 py-1 ${statusColor(r.status)}`}>{r.status}</span></td>
                      <td className="py-2.5">
                        {r.readings?.length > 1 && (
                          <button onClick={() => setSelected(selected?.id === r.id ? null : r)}
                            className="text-xs text-navy-500 dark:text-lightblue hover:underline">
                            {selected?.id === r.id ? t('hide_curve') : t('view_curve')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inline flow curve for selected row */}
            {selected?.readings?.length > 1 && (
              <div className="mt-5 pt-5 border-t border-navy-100 dark:border-white/10 animate-fade-in">
                <p className="text-xs text-navy-500 dark:text-lightblue mb-2">{new Date(selected.created_at).toLocaleString()}</p>
                <FlowChart readings={selected.readings} height={180} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
