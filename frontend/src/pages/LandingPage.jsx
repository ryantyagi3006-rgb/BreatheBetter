import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plug, Wind, ChartLine, ArrowRight, FilePdf } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import BreathingOrb from '../components/BreathingOrb';
import BreathMark from '../components/BreathMark';

function FeatureCard({ Icon, title, body, delay }) {
  return (
    <div className="glass-card flex flex-col gap-3 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="w-11 h-11 rounded-xl bg-navy-100/70 dark:bg-navy-500/20 flex items-center justify-center text-navy-600 dark:text-lightblue">
        <Icon size={24} weight="regular" />
      </div>
      <h3 className="font-bold text-navy-900 dark:text-white">{title}</h3>
      <p className="text-sm text-navy-600 dark:text-lightblue leading-relaxed">{body}</p>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { user } = useApp();
  const cta = user ? '/dashboard' : '/login';

  return (
    <div>
      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 self-start text-xs font-semibold text-navy-600 dark:text-lightblue bg-navy-100/60 dark:bg-white/10 rounded-full px-3 py-1.5 animate-fade-up">
            {t('school')} · {t('hero_badge')}
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-navy-900 dark:text-white tracking-tight leading-[1.05] animate-fade-up" style={{ animationDelay: '60ms' }}>
            {t('hero_title_1')}<br />
            <span className="bg-gradient-to-r from-navy-500 to-navy-300 dark:from-lightblue dark:to-navy-300 bg-clip-text text-transparent">{t('hero_title_2')}</span>
          </h1>
          <p className="text-lg text-navy-600 dark:text-lightblue leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: '120ms' }}>
            {t('hero_sub')}
          </p>
          <p className="italic text-navy-500 dark:text-lightblue/80 animate-fade-up" style={{ animationDelay: '160ms' }}>
            {t('tagline')} — <span className="not-italic text-sm">{t('tagline_gloss')}</span>
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Link to={cta} className="btn-primary px-7 py-3.5 text-base inline-flex items-center gap-2">
              {t('get_started')} <ArrowRight size={18} weight="bold" />
            </Link>
            <Link to="/about" className="btn-secondary px-7 py-3.5 text-base">{t('learn_more')}</Link>
          </div>

          {/* One-click AQI / lung-health guide */}
          <a
            href="/BreatheBetter-AQI-Lung-Health-Guide.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start text-sm font-medium text-navy-700 dark:text-lightblue bg-navy-100/60 dark:bg-white/10 hover:bg-navy-100 dark:hover:bg-white/15 rounded-full px-4 py-2.5 transition-colors animate-fade-up"
            style={{ animationDelay: '240ms' }}
          >
            <FilePdf size={18} weight="bold" /> {t('aqi_guide_cta')} <ArrowRight size={14} weight="bold" />
          </a>
        </div>

        {/* Hero visual */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '120ms' }}>
          <BreathingOrb size={300} active tone="brand">
            <BreathMark className="w-36 h-36 text-lightblue drop-shadow" />
          </BreathingOrb>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white text-center mb-2">{t('features_title')}</h2>
        <p className="text-center text-navy-500 dark:text-lightblue mb-10 max-w-xl mx-auto">{t('features_sub')}</p>
        <div className="grid sm:grid-cols-3 gap-5">
          <FeatureCard Icon={Plug} title={t('feat1_title')} body={t('feat1_body')} delay="0ms" />
          <FeatureCard Icon={Wind} title={t('feat2_title')} body={t('feat2_body')} delay="80ms" />
          <FeatureCard Icon={ChartLine} title={t('feat3_title')} body={t('feat3_body')} delay="160ms" />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="card bg-gradient-to-br from-navy-900 to-navy-700 dark:from-[#0f2137] dark:to-[#0a1628] text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('how_title')}</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-xl font-black">{n}</div>
                <h3 className="font-bold">{t(`how_step${n}_title`)}</h3>
                <p className="text-sm text-lightblue/90 leading-relaxed">{t(`how_step${n}_body`)}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={cta} className="inline-flex items-center gap-2 bg-white text-navy-900 font-semibold rounded-full px-7 py-3 hover:bg-lightblue transition-colors">
              {t('get_started')} <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SDG ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20 text-center">
        <p className="text-sm font-semibold text-navy-500 dark:text-lightblue mb-4">{t('sdg_label')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { num: 3, label: t('sdg3'), color: 'bg-green-500' },
            { num: 4, label: t('sdg4'), color: 'bg-red-500' },
            { num: 10, label: t('sdg10'), color: 'bg-pink-600' },
          ].map(s => (
            <span key={s.num} className={`${s.color} text-white text-sm font-bold rounded-xl px-4 py-2 shadow-sm`}>
              SDG {s.num} · {s.label}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
