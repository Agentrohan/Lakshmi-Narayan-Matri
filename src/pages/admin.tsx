import { useState } from 'react';
import { useNavigate } from "react-router";
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
const ADMIN_PASSWORD = 'Nilima@1976';
export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('lnm_admin', '1');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  }
  return <div className="bg-background min-h-screen flex items-center justify-center px-4 py-20">
      <Helmet>
        <title>Admin Login — Lakshmi Narayan Matrimony</title>
        <meta name="description" content="Admin login for Lakshmi Narayan Matrimony dashboard." />
        <link rel="canonical" href="https://lakshminarayanmatrimony.in/admin" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-xl" style={{
      border: '2px solid rgba(201,168,76,0.4)'
    }} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4,
      ease: 'easeOut' as const
    }}>
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center bg-primary mx-auto mb-3 overflow-hidden">
            <img src="/assets/logo.png" alt="Lakshmi Narayan Matrimony Logo" className="w-11 h-11 object-contain" />
          </div>
          <h1 className="font-heading text-primary text-xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground text-xs mt-1">Lakshmi Narayan Matrimony</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-card-foreground/70">Admin Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => {
              setPassword(e.target.value);
              setError('');
            }} className="w-full rounded border border-accent/40 bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="Enter password" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPw ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                </svg>
              </button>
            </div>
          </div>

          {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-xs text-destructive">
              {error}
            </div>}

          <button type="submit" className="w-full py-3 rounded-lg font-heading font-bold text-sm text-primary-foreground transition-all duration-200 hover:opacity-90" style={{
          background: '#2D1B69',
          border: '2px solid #C9A84C'
        }}>
            Login
          </button>
        </form>
      </motion.div>
    </div>;
}
