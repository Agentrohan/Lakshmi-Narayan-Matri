import { Link } from "react-router";
export default function Footer() {
  return <footer className="bg-primary text-primary-foreground pt-10 pb-4 px-6 border-t-2 border-accent">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-px flex-1 max-w-xs bg-accent/40" />
        <img src="/assets/logo.png" alt="Lakshmi Narayan Matrimony" className="w-10 h-10 object-contain opacity-80" />
        <div className="h-px flex-1 max-w-xs bg-accent/40" />
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <p className="font-heading text-accent text-lg font-bold mb-1">Lakshmi Narayan Matrimony</p>
          <p className="text-accent/60 text-xs tracking-widest uppercase mb-3">लक्ष्मी नारायण वधू-वर सूचक</p>
          <p className="text-primary-foreground/60 text-sm leading-relaxed">
            Trusted, personalized matchmaking rooted in tradition. No public profiles. 100% confidential.
          </p>
        </div>
        <div>
          <p className="font-heading text-accent text-sm font-semibold mb-3 uppercase tracking-wide">Quick Links</p>
          <div className="flex flex-col gap-2">
            {[['/', 'Home'], ['/about', 'About Us'], ['/how-it-works', 'How It Works'], ['/register', 'Register Now'], ['/contact', 'Contact Us']].map(([to, label]) => <Link key={to} to={to} className="text-primary-foreground/60 text-sm hover:text-accent transition-colors">{label}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-heading text-accent text-sm font-semibold mb-3 uppercase tracking-wide">Contact</p>
          <p className="text-primary-foreground/60 text-sm mb-1">📞 +91 9225800617  +91 8830287057</p>
          <p className="text-primary-foreground/60 text-sm mb-1">✉️ lakshminarayanmatri@gmail.com</p>
          <p className="text-primary-foreground/60 text-sm">📍 Maharashtra, Karnataka</p>
        </div>
      </div>

      <div className="h-px bg-accent/20 mb-4" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-primary-foreground/30 text-xs">
          © {new Date().getFullYear()} Lakshmi Narayan Matrimony. All rights reserved.
        </p>
        <Link to="/admin" className="text-primary-foreground/20 text-xs hover:text-primary-foreground/40 transition-colors">
          Admin Login
        </Link>
      </div>
    </footer>;
}
