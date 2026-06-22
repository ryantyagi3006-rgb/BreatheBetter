import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Warning } from '@phosphor-icons/react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative z-10 border-t border-navy-100/50 dark:border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
          <Link to="/" className="text-navy-500 dark:text-lightblue hover:text-navy-800 dark:hover:text-white transition-colors">{t('nav_home')}</Link>
          <Link to="/about" className="text-navy-500 dark:text-lightblue hover:text-navy-800 dark:hover:text-white transition-colors">{t('nav_about')}</Link>
          <Link to="/outreach" className="text-navy-500 dark:text-lightblue hover:text-navy-800 dark:hover:text-white transition-colors">{t('nav_outreach')}</Link>
          <Link to="/safe-use" className="text-navy-500 dark:text-lightblue hover:text-navy-800 dark:hover:text-white transition-colors">{t('nav_safe_use')}</Link>
          <Link to="/dashboard" className="text-navy-500 dark:text-lightblue hover:text-navy-800 dark:hover:text-white transition-colors">{t('nav_dashboard')}</Link>
        </div>
        <p className="text-xs text-navy-400 dark:text-lightblue/80 font-semibold max-w-md inline-flex items-center gap-1.5 justify-center">
          <Warning size={14} weight="fill" className="flex-shrink-0" /> {t('disclaimer')}
        </p>
        <p className="text-xs text-navy-500 dark:text-lightblue/80 italic">{t('footer_sig')}</p>
      </div>
    </footer>
  );
}
