import { useState } from 'react';
import { Link, useLocation } from "react-router";
const navLinks = [{
  label: 'Home',
  to: '/'
}, {
  label: 'About Us',
  to: '/about'
}, {
  label: 'How It Works',
  to: '/how-it-works'
}, {
  label: 'Contact Us',
  to: '/contact'
}];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  return <header className="w-full bg-primary border-b-2 border-accent shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center bg-primary shrink-0 overflow-hidden">
            <img src="/assets/logo.png" alt="Lakshmi Narayan Matrimony Logo" className="w-12 h-12 object-contain" />
          </div>
          <div>
            <p className="text-accent font-heading font-bold text-lg md:text-xl leading-tight">Lakshmi Narayan Matrimony</p>
            <p className="text-accent/70 text-xs italic">लक्ष्मी नारायण वधू-वर सूचक</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => <Link key={link.to} to={link.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${location.pathname === link.to ? 'bg-accent text-primary font-semibold' : 'text-accent/80 hover:text-accent hover:bg-primary-foreground/10'}`}>
              {link.label}
            </Link>)}
          <Link to="/register" className="ml-3 px-5 py-2 rounded-lg text-sm font-semibold text-primary bg-accent hover:bg-accent/90 transition-all duration-150 shadow-sm font-heading">
            Register Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden text-accent p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && <div className="md:hidden bg-primary border-t border-accent/30 px-4 pb-4">
          {navLinks.map(link => <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={`block py-3 text-sm font-medium border-b border-accent/20 ${location.pathname === link.to ? 'text-accent font-semibold' : 'text-accent/70'}`}>
              {link.label}
            </Link>)}
          <Link to="/register" onClick={() => setMenuOpen(false)} className="block mt-3 text-center py-3 rounded-lg text-sm font-semibold text-primary bg-accent font-heading">
            Register Now
          </Link>
        </div>}
    </header>;
}
