import { useTranslation } from 'react-i18next';
import { Plug, Warning } from '@phosphor-icons/react';

export default function UsbBanner({ connected, portLabel, disconnected, liveReading }) {
  const { t } = useTranslation();

  if (disconnected) {
    return (
      <div className="mb-4 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl px-5 py-3 animate-fade-in">
        <Warning size={20} weight="fill" className="text-red-500 flex-shrink-0" />
        <p className="text-sm font-medium text-red-700 dark:text-red-300">{t('disconnected_banner')}</p>
      </div>
    );
  }

  if (!connected) return null;

  return (
    <div className="mb-4 flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-5 py-3 animate-fade-in">
      <Plug size={22} weight="fill" className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{t('connected_label')}</p>
        {portLabel && <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 truncate">{portLabel}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">{t('live_reading')}</p>
        <p className="text-base font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
          {liveReading != null ? `${liveReading.toFixed(1)} cm` : '–'}
        </p>
      </div>
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
    </div>
  );
}
