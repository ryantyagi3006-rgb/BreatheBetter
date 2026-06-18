import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wind } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';
import BreathingOrb from '../components/BreathingOrb';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass]   = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !pass) { setError(t('login_need_both')); return; }
    setBusy(true);
    try {
      await login(email.trim(), pass);
      navigate('/dashboard');
    } catch (err) {
      const code = err?.code || '';
      const map = {
        'auth/wrong-password': t('err_wrong_pass'),
        'auth/weak-password': t('err_weak_pass'),
        'auth/email-already-in-use': t('err_email_used'),
        'auth/invalid-email': t('err_invalid_email'),
        'auth/too-many-requests': t('err_too_many'),
        'auth/network-request-failed': t('err_network'),
      };
      setError(map[code] || err.message || t('err_generic'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-6 animate-fade-up">
        <BreathingOrb size={120} active tone="neutral">
          <Wind size={32} weight="light" />
        </BreathingOrb>

        <div className="text-center">
          <h1 className="text-3xl font-black text-navy-900 dark:text-white">{t('login_welcome')}</h1>
          <p className="text-sm text-navy-500 dark:text-lightblue mt-1">{t('login_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 card">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}
          <input className="input-field" type="email" placeholder={t('email_placeholder')}
            value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          <input className="input-field" type="password" placeholder={t('password_placeholder')}
            value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" minLength={6} required />
          <p className="text-navy-500/80 dark:text-lightblue/70 text-xs text-center leading-relaxed px-2">{t('login_hint')}</p>
          <button type="submit" disabled={busy} className="btn-primary py-4 text-base disabled:opacity-60">
            {busy ? t('logging_in') : t('login_btn')}
          </button>
        </form>

        <p className="text-xs text-navy-400 dark:text-lightblue/70 text-center">
          {t('presented_by')} <span className="font-semibold text-navy-700 dark:text-white">Ryan Tyagi</span> · {t('school')}
        </p>
      </div>
    </div>
  );
}
