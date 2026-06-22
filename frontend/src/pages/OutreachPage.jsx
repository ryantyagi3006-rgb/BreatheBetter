import { useTranslation } from 'react-i18next';
import {
  Megaphone, CheckCircle, FilePdf, ArrowSquareOut, DownloadSimple, Envelope, Phone,
} from '@phosphor-icons/react';

const REPORT = '/BreatheBetter-Community-Outreach-Report.pdf';
const EMAIL = 'ryan.tyagi2462@dpsiedge.edu.in';
const PHONE_DISPLAY = '+91 98185 48392';
const PHONE_HREF = 'tel:+919818548392';
const MAILTO =
  `mailto:${EMAIL}?subject=${encodeURIComponent('BreatheBetter Community Outreach — Sign-up')}` +
  `&body=${encodeURIComponent(
    'Hi Ryan,\n\nWe would like to host a free BreatheBetter Lung Health Check.\n\n' +
    'Organisation:\nLocation:\nApprox. participants:\nPreferred dates:\n\nThank you.'
  )}`;

function Section({ title, children, delay }) {
  return (
    <section className="card animate-fade-up" style={{ animationDelay: delay }}>
      {title && <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">{title}</h2>}
      {children}
    </section>
  );
}

export default function OutreachPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3 animate-fade-up">
        <div className="w-14 h-14 rounded-2xl bg-navy-100/70 dark:bg-navy-500/20 flex items-center justify-center text-navy-600 dark:text-lightblue">
          <Megaphone size={30} weight="regular" />
        </div>
        <h1 className="text-4xl font-black text-navy-900 dark:text-white">{t('outreach_title')}</h1>
        <p className="text-navy-500 dark:text-lightblue max-w-xl">{t('outreach_sub')}</p>
      </div>

      {/* About the programme */}
      <Section title={t('outreach_about_title')} delay="40ms">
        <p className="text-navy-600 dark:text-lightblue leading-relaxed">{t('outreach_body')}</p>
      </Section>

      {/* Core aims */}
      <Section title={t('outreach_aims_title')} delay="80ms">
        <ul className="flex flex-col gap-3">
          {['outreach_aim_1', 'outreach_aim_2', 'outreach_aim_3'].map(k => (
            <li key={k} className="flex items-start gap-3">
              <CheckCircle size={20} weight="fill" className="text-navy-500 dark:text-navy-300 mt-0.5 flex-shrink-0" />
              <span className="text-navy-600 dark:text-lightblue leading-relaxed">{t(k)}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Report */}
      <Section delay="120ms">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-navy-100/70 dark:bg-navy-500/20 flex items-center justify-center text-navy-600 dark:text-lightblue flex-shrink-0">
            <FilePdf size={24} weight="regular" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white leading-tight">{t('outreach_report_title')}</h2>
            <p className="text-sm text-navy-500 dark:text-lightblue mt-1 leading-relaxed">{t('outreach_report_desc')}</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-navy-100 dark:border-white/10 bg-navy-50 dark:bg-black/20">
          <object data={`${REPORT}#view=FitH&toolbar=0`} type="application/pdf" className="w-full h-[440px]" aria-label={t('outreach_report_title')}>
            <div className="p-6 text-center text-sm text-navy-500 dark:text-lightblue">
              <a href={REPORT} target="_blank" rel="noreferrer" className="underline">{t('view_pdf')}</a>
            </div>
          </object>
        </div>

        <div className="flex gap-2 mt-4">
          <a href={REPORT} target="_blank" rel="noreferrer" className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
            <ArrowSquareOut size={16} weight="bold" /> {t('view_pdf')}
          </a>
          <a href={REPORT} download className="btn-secondary text-sm px-5 py-2.5 inline-flex items-center gap-2">
            <DownloadSimple size={16} weight="bold" /> {t('download_pdf')}
          </a>
        </div>
      </Section>

      {/* Host a check */}
      <Section title={t('outreach_host_title')} delay="160ms">
        <div className="space-y-3 text-navy-600 dark:text-lightblue leading-relaxed">
          <p>{t('outreach_host_1')}</p>
          <p>{t('outreach_host_2')}</p>
          <p>{t('outreach_host_3')}</p>
        </div>
      </Section>

      {/* Contact / CTA */}
      <div className="card bg-gradient-to-br from-navy-900 to-navy-700 text-white text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-2xl font-black mb-2">{t('outreach_signup_cta')}</h2>
        <p className="text-sm text-lightblue/90 max-w-md mx-auto mb-6">{t('outreach_host_3')}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a href={MAILTO} className="bg-white text-navy-900 font-semibold rounded-full px-6 py-3 hover:bg-lightblue transition-colors inline-flex items-center gap-2">
            <Envelope size={18} weight="bold" /> {t('outreach_signup_cta')}
          </a>
          <a href={PHONE_HREF} className="border border-white/40 text-white font-semibold rounded-full px-6 py-3 hover:bg-white/10 transition-colors inline-flex items-center gap-2">
            <Phone size={18} weight="bold" /> {PHONE_DISPLAY}
          </a>
        </div>

        <div className="mt-5 text-sm text-lightblue/80 space-y-1">
          <p><a href={MAILTO} className="hover:text-white transition-colors">{EMAIL}</a></p>
          <p className="text-xs text-lightblue/80">{t('outreach_tariff')}</p>
        </div>
      </div>
    </div>
  );
}
