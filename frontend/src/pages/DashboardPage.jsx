import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plug, Warning, ClockCounterClockwise, ArrowRight, Check } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import ResultHero from '../components/ResultHero';
import LevelsCard from '../components/LevelsCard';
import InstructionsCard from '../components/InstructionsCard';
import UsbBanner from '../components/UsbBanner';
import TestOverlay from '../components/TestOverlay';
import CalibrationModal from '../components/CalibrationModal';

function Stepper({ step }) {
  const { t } = useTranslation();
  const steps = [t('step_connect'), t('step_measure'), t('step_review')];
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i <= step ? 'bg-navy-900 dark:bg-navy-500 text-white' : 'bg-navy-100 dark:bg-white/10 text-navy-600 dark:text-lightblue/80'
            }`}>{i < step ? <Check size={14} weight="bold" /> : i + 1}</span>
            <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-navy-900 dark:text-white' : 'text-navy-500 dark:text-lightblue/80'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && <span className={`w-6 sm:w-12 h-0.5 rounded ${i < step ? 'bg-navy-900 dark:bg-navy-500' : 'bg-navy-100 dark:bg-white/10'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const {
    connected, liveReading, portLabel, supported, disconnected, connectError, handleConnect,
    status, fev1, fvc, ratio, readings,
    testOpen, testStep, savedFlash, calFactor, setCalFactor, startTest, captureWindow,
  } = useApp();
  const [calOpen, setCalOpen] = useState(false);

  const step = status != null ? 2 : connected ? 1 : 0;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white">{t('dashboard_title')}</h1>
          <p className="text-sm text-navy-500 dark:text-lightblue">{t('dashboard_sub')}</p>
        </div>
        {!connected && (
          <button onClick={() => handleConnect(t)} className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2">
            <Plug size={16} weight="bold" /> {t('connect_device')}
          </button>
        )}
      </div>

      <Stepper step={step} />

      {/* Banners */}
      {!supported && (
        <div className="mb-4 text-center text-sm font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-xl px-5 py-3">
          {t('serial_unsupported')}
        </div>
      )}
      <UsbBanner connected={connected} portLabel={portLabel} disconnected={disconnected} liveReading={liveReading} />
      {connectError && (
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-5 py-3">
          <Warning size={18} weight="fill" className="flex-shrink-0" /> {connectError}
        </div>
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        {/* Result hero — spans 2 on desktop */}
        <div className="lg:col-span-2 glass-card flex flex-col items-center justify-center animate-fade-up min-h-[340px]">
          <ResultHero status={status} ratio={ratio} connected={connected} />
        </div>

        {/* Levels + actions */}
        <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          <LevelsCard
            fev1={fev1} fvc={fvc} ratio={ratio} readings={readings}
            calibrated={calFactor !== 1} connected={connected}
            onTest={() => startTest(t)} onCalibrate={() => setCalOpen(true)}
          />
        </div>
      </div>

      {/* Instructions + history link */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <InstructionsCard liveReading={liveReading} connected={connected} />
        </div>
        <div className="card flex flex-col justify-center items-center text-center gap-3 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <ClockCounterClockwise size={32} weight="light" className="text-navy-500 dark:text-lightblue" />
          <h3 className="font-bold text-navy-900 dark:text-white">{t('history_title')}</h3>
          <p className="text-sm text-navy-500 dark:text-lightblue">{t('history_cta_sub')}</p>
          <Link to="/history" className="btn-secondary text-sm px-5 inline-flex items-center gap-2">
            {t('view_history')} <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>

      {/* Overlays */}
      <TestOverlay open={testOpen} stepTitle={testStep.title} stepMsg={testStep.msg} progress={testStep.progress} />
      <CalibrationModal open={calOpen} onClose={() => setCalOpen(false)} onCalibrated={setCalFactor} captureWindow={captureWindow} />

      {savedFlash && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold rounded-full px-5 py-3 shadow-lg animate-fade-in">
          <Check size={16} weight="bold" /> {t('saved_flash')}
        </div>
      )}
    </div>
  );
}
