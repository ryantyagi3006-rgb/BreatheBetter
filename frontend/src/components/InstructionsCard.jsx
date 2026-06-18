import { useTranslation } from 'react-i18next';

function PillBadge({ children }) {
  return (
    <span className="inline-flex items-center bg-navy-100 dark:bg-navy-500/30 text-navy-700 dark:text-lightblue text-xs font-semibold rounded-full px-2 py-0.5 mx-0.5">
      {children}
    </span>
  );
}

export default function InstructionsCard({ liveReading, connected }) {
  const { t } = useTranslation();
  const steps = [
    <>{t('step1')}</>,
    <>{t('step2')} <PillBadge>{t('connect_device')}</PillBadge></>,
    <>{t('step3')}</>,
    <>{t('step4')} <PillBadge>{t('test_btn')}</PillBadge></>,
    <>{t('step5')}</>,
  ];

  return (
    <div className="card flex flex-col gap-5 animate-fade-up" style={{ animationDelay: '50ms' }}>
      <h2 className="text-lg font-bold text-navy-900 dark:text-white">{t('instructions_title')}</h2>

      <ol className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="min-w-[26px] h-[26px] rounded-full bg-navy-900 dark:bg-navy-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-navy-600 dark:text-lightblue">{step}</span>
          </li>
        ))}
      </ol>

      {/* Live USB mini-feed */}
      {connected && (
        <div className="mt-auto bg-navy-950/5 dark:bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3 border border-navy-100 dark:border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <div>
            <p className="text-xs text-navy-400 dark:text-lightblue font-medium">{t('live_reading')}</p>
            <p className="text-base font-bold text-navy-900 dark:text-white">
              {liveReading != null ? `${liveReading.toFixed(1)} cm` : 'Waiting…'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
