import { useTranslation } from 'react-i18next';

export default function TestOverlay({ open, stepTitle, stepMsg, progress }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0f2137] rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-5 w-full max-w-sm mx-4">
        <h3 className="text-xl font-bold text-navy-900 dark:text-white text-center">{stepTitle || t('preparing')}</h3>

        {/* Breathing animation */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy-400 to-navy-600 animate-breathe-fast shadow-lg" />

        <p className="text-sm text-navy-500 dark:text-lightblue text-center">{stepMsg}</p>

        {/* Progress bar */}
        <div className="w-full progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress ?? 0}%`, background: '#185FA5', transition: 'width 0.4s linear' }}
          />
        </div>
        <p className="text-xs text-navy-400 dark:text-navy-400">{Math.round(progress ?? 0)}%</p>
      </div>
    </div>
  );
}
