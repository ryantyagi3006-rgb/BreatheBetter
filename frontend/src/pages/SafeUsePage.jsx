import { useTranslation } from 'react-i18next';
import { ShieldCheck, FilePdf, ArrowSquareOut, DownloadSimple, CheckCircle } from '@phosphor-icons/react';

function DocCard({ icon: Icon, title, desc, topics, file, delay }) {
  const { t } = useTranslation();
  return (
    <div className="glass-card flex flex-col gap-4 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-navy-100/70 dark:bg-navy-500/20 flex items-center justify-center text-navy-600 dark:text-lightblue flex-shrink-0">
          <Icon size={24} weight="regular" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-navy-900 dark:text-white leading-tight">{title}</h2>
          <p className="text-sm text-navy-500 dark:text-lightblue mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>

      {/* Topics covered */}
      <div>
        <p className="text-xs font-semibold text-navy-400 dark:text-lightblue/70 mb-2">{t('in_this_doc')}</p>
        <ul className="flex flex-col gap-1.5">
          {topics.map((tp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-navy-700 dark:text-lightblue">
              <CheckCircle size={16} weight="fill" className="text-navy-500 dark:text-navy-400 mt-0.5 flex-shrink-0" />
              {tp}
            </li>
          ))}
        </ul>
      </div>

      {/* Embedded preview */}
      <div className="rounded-xl overflow-hidden border border-navy-100 dark:border-white/10 bg-navy-50 dark:bg-black/20">
        <object data={`${file}#view=FitH&toolbar=0`} type="application/pdf" className="w-full h-[420px]" aria-label={t('preview_label')}>
          <div className="p-6 text-center text-sm text-navy-500 dark:text-lightblue">
            {t('preview_label')} — <a href={file} target="_blank" rel="noreferrer" className="text-navy-600 dark:text-lightblue underline">{t('view_pdf')}</a>
          </div>
        </object>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <a href={file} target="_blank" rel="noreferrer" className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
          <ArrowSquareOut size={16} weight="bold" /> {t('view_pdf')}
        </a>
        <a href={file} download className="btn-secondary text-sm px-5 py-2.5 inline-flex items-center gap-2">
          <DownloadSimple size={16} weight="bold" /> {t('download_pdf')}
        </a>
      </div>
    </div>
  );
}

export default function SafeUsePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 animate-fade-up">
        <div className="w-14 h-14 rounded-2xl bg-navy-100/70 dark:bg-navy-500/20 flex items-center justify-center text-navy-600 dark:text-lightblue">
          <ShieldCheck size={30} weight="regular" />
        </div>
        <h1 className="text-4xl font-black text-navy-900 dark:text-white">{t('safe_use_title')}</h1>
        <p className="text-navy-500 dark:text-lightblue max-w-xl">{t('safe_use_sub')}</p>
      </div>

      {/* Two documents */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DocCard
          icon={ShieldCheck}
          title={t('doc_charter_title')}
          desc={t('doc_charter_desc')}
          topics={[t('charter_topic_1'), t('charter_topic_2'), t('charter_topic_3')]}
          file="/Safe-Use-BreatheBetter.pdf"
          delay="0ms"
        />
        <DocCard
          icon={FilePdf}
          title={t('doc_policies_title')}
          desc={t('doc_policies_desc')}
          topics={[
            t('policy_topic_1'), t('policy_topic_2'), t('policy_topic_3'),
            t('policy_topic_4'), t('policy_topic_5'), t('policy_topic_6'),
          ]}
          file="/BreatheBetter-Policies.pdf"
          delay="80ms"
        />
      </div>
    </div>
  );
}
