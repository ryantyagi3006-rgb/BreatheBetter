import { useTranslation } from 'react-i18next';

// Centrepiece explainer for the About page. The "video" is a self-contained
// interactive HTML animation (a ~64s vertical explainer with its own playback
// controls) exported from Claude Design, served from public/ and framed in a
// portrait "reel" so it sits at natural 9:16 aspect.
export default function ExplainerVideo() {
  const { t } = useTranslation();

  return (
    <section
      className="glass-card !p-0 overflow-hidden animate-fade-up relative"
      style={{ animationDelay: '20ms' }}
    >
      {/* Accent ring to make it the visual centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-navy-300/30 dark:ring-lightblue/20"
      />

      <div className="p-6 pb-4 text-center">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-navy-500 dark:text-lightblue/80">
          {t('about_video_eyebrow')}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white mt-1.5">
          {t('about_video_title')}
        </h2>
        <p className="text-sm text-navy-500 dark:text-lightblue mt-2 max-w-xl mx-auto leading-relaxed">
          {t('about_video_sub')}
        </p>
      </div>

      {/* Portrait reel */}
      <div className="px-6 pb-8 pt-2 flex justify-center">
        <div className="relative">
          {/* soft glow behind the frame */}
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-navy-400/20 dark:bg-lightblue/10 blur-2xl"
          />
          <div className="relative w-[min(86vw,380px)] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            <iframe
              src="/breathebetter-explainer.html"
              title={t('about_video_title')}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allow="autoplay; fullscreen"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
