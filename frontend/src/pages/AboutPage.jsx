import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from '@phosphor-icons/react';
import BreathMark from '../components/BreathMark';

function Section({ title, children, delay }) {
  return (
    <section className="card animate-fade-up" style={{ animationDelay: delay }}>
      <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  const { t } = useTranslation();

  const wiring = [
    ['VCC', '5V'], ['GND', 'GND'], ['TRIG', 'D9'], ['ECHO', 'D10'],
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3 animate-fade-up">
        <BreathMark className="w-14 h-14 text-navy-600 dark:text-lightblue" />
        <h1 className="text-4xl font-black text-navy-900 dark:text-white">{t('about_title')}</h1>
        <p className="italic text-navy-500 dark:text-lightblue">{t('tagline')} — {t('tagline_gloss')}</p>

        {/* Affiliation: DPS International */}
        <div className="flex items-center justify-center mt-3">
          <span className="bg-white rounded-xl px-5 py-2.5 shadow-sm border border-navy-100/70 flex items-center">
            <img src="/dps-logo.png" alt="DPS International" className="h-9 w-auto object-contain" />
          </span>
        </div>
      </div>

      {/* Mission */}
      <Section title={t('about_mission_title')} delay="40ms">
        <div className="space-y-3 text-navy-600 dark:text-lightblue leading-relaxed">
          <p>{t('about_body_1')}</p>
          <p>{t('about_body_2')}</p>
          <p>{t('about_body_3')}</p>
        </div>
      </Section>

      {/* Science */}
      <Section title={t('about_science_title')} delay="80ms">
        <div className="space-y-3 text-navy-600 dark:text-lightblue leading-relaxed">
          <p>{t('about_science_1')}</p>
          <ul className="space-y-2 mt-2">
            {['fev1', 'fvc', 'ratio'].map(k => (
              <li key={k} className="flex gap-3 items-start">
                <span className="font-bold text-navy-700 dark:text-white min-w-[90px]">{t(k)}</span>
                <span className="text-sm">{t('about_def_' + k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Hardware */}
      <Section title={t('about_hardware_title')} delay="120ms">
        <p className="text-navy-600 dark:text-lightblue leading-relaxed mb-4">{t('about_hardware_1')}</p>
        <div className="rounded-xl border border-navy-100 dark:border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50 dark:bg-white/5">
                <th className="text-left font-semibold text-navy-600 dark:text-lightblue px-4 py-2">HC-SR04</th>
                <th className="text-left font-semibold text-navy-600 dark:text-lightblue px-4 py-2">Arduino</th>
              </tr>
            </thead>
            <tbody>
              {wiring.map(([a, b]) => (
                <tr key={a} className="border-t border-navy-100 dark:border-white/10">
                  <td className="px-4 py-2 font-mono text-navy-900 dark:text-white">{a}</td>
                  <td className="px-4 py-2 font-mono text-navy-900 dark:text-white">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-navy-400 dark:text-lightblue/70 mt-3">{t('about_hardware_2')}</p>
      </Section>

      {/* SDG */}
      <Section title={t('about_sdg_title')} delay="160ms">
        {/* SDG graphic (2.png) — hidden gracefully until the SDG image is supplied */}
        <div className="mb-5 flex justify-center">
          <img
            src="/2.png"
            alt="UN Sustainable Development Goals"
            className="w-full max-w-xl rounded-xl"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div className="flex flex-col gap-3">
          {[
            { num: 3, label: t('sdg3'), body: t('sdg3_body'), color: 'border-green-500' },
            { num: 4, label: t('sdg4'), body: t('sdg4_body'), color: 'border-red-500' },
            { num: 10, label: t('sdg10'), body: t('sdg10_body'), color: 'border-pink-600' },
          ].map(s => (
            <div key={s.num} className={`border-l-4 ${s.color} pl-4 py-1`}>
              <p className="font-bold text-navy-900 dark:text-white">SDG {s.num} — {s.label}</p>
              <p className="text-sm text-navy-600 dark:text-lightblue">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Credits + disclaimer */}
      <div className="card bg-gradient-to-br from-navy-900 to-navy-700 text-white text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
        <p className="text-sm text-lightblue/90 mb-1">{t('presented_by')}</p>
        <p className="text-2xl font-black mb-3">Ryan Tyagi</p>
        <p className="text-sm text-lightblue/80 max-w-md mx-auto">{t('about_credit')}</p>
        <p className="text-xs text-lightblue/70 font-semibold mt-5">{t('disclaimer')}</p>
        <Link to="/login" className="inline-flex items-center gap-2 mt-5 bg-white text-navy-900 font-semibold rounded-full px-6 py-3 hover:bg-lightblue transition-colors">
          {t('get_started')} <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
