import { useTranslation } from 'react-i18next';
import { Wind } from '@phosphor-icons/react';
import BreathingOrb from './BreathingOrb';

export default function ResultHero({ status, ratio, connected }) {
  const { t } = useTranslation();
  const hasResult = status != null;

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <BreathingOrb size={220} active={connected || hasResult} tone={hasResult ? status : 'neutral'}>
        {hasResult ? (
          <div className="text-center">
            <p className="text-4xl font-black leading-none">{ratio}<span className="text-xl">%</span></p>
            <p className="text-[10px] tracking-widest opacity-80 mt-1">FEV1 / FVC</p>
          </div>
        ) : (
          <div className="flex flex-col items-center px-3">
            <Wind size={30} weight="light" />
            <p className="text-[10px] tracking-wide opacity-80 mt-1">{connected ? t('ready') : t('idle_short')}</p>
          </div>
        )}
      </BreathingOrb>

      {hasResult ? (
        <div className="text-center">
          <p className={`text-2xl font-extrabold ${
            status === 'Normal' ? 'text-emerald-600 dark:text-emerald-400'
            : status === 'Borderline' ? 'text-amber-600 dark:text-amber-400'
            : 'text-red-600 dark:text-red-400'
          }`}>
            {t('status_' + status.toLowerCase())}
          </p>
          <p className="text-sm text-navy-500 dark:text-lightblue italic mt-2 max-w-sm leading-relaxed">
            {t('advice_' + status.toLowerCase())}
          </p>
        </div>
      ) : (
        <p className="text-sm text-navy-400 dark:text-lightblue text-center">{t('status_idle')}</p>
      )}
    </div>
  );
}
