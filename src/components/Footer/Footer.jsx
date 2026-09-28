import { Dumbbell } from 'lucide-react';
import { FaXTwitter, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa6';
import { FOOTER_LINKS } from '../../utils/data';

const SOCIAL_ICONS = [
  { icon: FaXTwitter, href: '#', label: 'Twitter' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaDiscord, href: '#', label: 'Discord' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#home" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CFF5B] to-[#5BE7FF] flex items-center justify-center shadow-lg shadow-[#7CFF5B]/20">
                <Dumbbell className="w-5 h-5 text-[#070707]" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fit<span className="text-[#7CFF5B]">Pulse</span>
              </span>
            </a>
            <p className="text-sm text-[#B8B8B8] leading-relaxed mb-6">
              The most intelligent fitness platform to track every rep, meal, and milestone.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_ICONS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-[#181818] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#B8B8B8] hover:text-white hover:bg-[#222] hover:border-[rgba(255,255,255,0.12)] transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#B8B8B8] hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#B8B8B8]/60">
            &copy; {new Date().getFullYear()} FitPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#B8B8B8]/60 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-[#B8B8B8]/60 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-[#B8B8B8]/60 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}