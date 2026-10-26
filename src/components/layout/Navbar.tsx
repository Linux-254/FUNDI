import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  Briefcase, 
  Users, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { api } from '../../lib/api';
import { UserRole } from '../../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currency: 'KES' | 'USD';
  onCurrencyToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currency,
  onCurrencyToggle
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const location = useLocation();

  const roleLabels: Record<UserRole, string> = {
    owner: 'Owner / Developer',
    contractor: 'Contractor (NCA)',
    expert: 'Architect / QS / Eng',
    labour: 'Fundi / Labour Lead',
    supplier: 'Supplier / Equipment',
    verifier: 'Independent Verifier',
    admin: 'Admin Console'
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Workspace', path: '/app/projects/proj-karen-villa' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Knowledge Base', path: '/knowledge-base' },
    { label: 'Escrow & Trust', path: '/trust' },
    { label: 'Pricing', path: '/pricing' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/projects')) return true;
    if (path.startsWith('/app/projects') && location.pathname.startsWith('/app/projects')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#2B4560]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-[#0B1B2B] flex items-center justify-center text-white font-bold tracking-wider shadow-sm group-hover:bg-[#1F6FEB] transition-colors">
                <Building2 className="w-5 h-5 text-[#C8A24A]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-[#0B1B2B]">
                  FUNDI<span className="text-[#1F6FEB]">.</span>
                </span>
                <span className="text-[10px] font-medium tracking-wide text-[#2B4560]/70 uppercase -mt-1 hidden sm:block">
                  Build with certainty
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Clean, Single Line, No Pills) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium tracking-tight whitespace-nowrap transition-colors py-1 ${
                  isActive(item.path)
                    ? 'text-[#1F6FEB] font-semibold border-b-2 border-[#1F6FEB]'
                    : 'text-[#2B4560] hover:text-[#0B1B2B]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Currency, Role Selector & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Currency toggle for diaspora users */}
            <button
              onClick={onCurrencyToggle}
              className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md border border-[#2B4560]/20 bg-white/80 hover:bg-white text-[#0B1B2B] shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              title="Toggle between KES and USD for Diaspora owners"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>{currency}</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#2B4560]/20 bg-white hover:bg-[#F4F1EA] text-[#0B1B2B] transition-colors cursor-pointer shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-[#1F6FEB]" />
                <span className="max-w-[120px] truncate">{roleLabels[currentRole]}</span>
                <ChevronDown className="w-3 h-3 text-[#2B4560]/60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-[#2B4560]/15 shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#2B4560]/60 uppercase tracking-wider border-b border-[#2B4560]/10">
                    Switch Test Persona
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F4F1EA] transition-colors cursor-pointer ${
                        currentRole === r ? 'font-bold text-[#1F6FEB] bg-[#1F6FEB]/5' : 'text-[#0B1B2B]'
                      }`}
                    >
                      <span>{roleLabels[r]}</span>
                      {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-[#1F6FEB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <Link
              to="/app/projects/proj-karen-villa"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B1B2B] hover:bg-[#1F6FEB] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#C8A24A]" />
              <span>Project Workspace</span>
            </Link>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-[#2B4560] md:hidden hover:bg-black/5"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2B4560]/10 bg-[#F4F1EA] px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path) ? 'bg-[#1F6FEB]/10 text-[#1F6FEB] font-semibold' : 'text-[#0B1B2B]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#2B4560]/10 flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#2B4560]/70">Simulate Persona:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1.5 text-[11px] text-left rounded border transition-colors ${
                    currentRole === r
                      ? 'border-[#1F6FEB] bg-[#1F6FEB]/10 text-[#1F6FEB] font-bold'
                      : 'border-[#2B4560]/15 bg-white text-[#0B1B2B]'
                  }`}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
