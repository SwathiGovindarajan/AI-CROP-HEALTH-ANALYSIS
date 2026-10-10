import React, { useState, useRef, useEffect } from 'react';
import { HOTLINKED_ASSETS, PageId, UserAccount, UserRole, USER_ACCOUNTS } from '../data/agroData';

interface HeaderProps {
  activePage: PageId;
  onNavigate: (page: PageId, searchPreset?: string) => void;
  currentUser: UserAccount;
  onSwitchRole: (role: UserRole) => void;
  activeParcel: string;
  onChangeParcel: (parcel: string) => void;
}

const PARCEL_OPTIONS = [
  'Green Valley Field #4 - Corn & Tomato',
  'Oakridge North Block #2 - Potato & Wheat',
  'Riverbend Greenhouse Sector A - Heirloom Tomato',
  'San Joaquin Experimental Station #1 - Rice & Cereal',
];

const QUICK_SEARCH_SUGGESTIONS = [
  { label: 'Plant Health Analysis', page: 'plant-health-analysis' as PageId, tag: 'Dedicated Page' },
  { label: 'Tomato Early Blight (Alternaria solani)', page: 'plant-health-analysis' as PageId, tag: 'Fungal Disease' },
  { label: 'Potato Late Blight (Phytophthora infestans)', page: 'plant-health-analysis' as PageId, tag: 'Oomycete' },
  { label: 'Common Corn Leaf Rust (Puccinia sorghi)', page: 'plant-health-analysis' as PageId, tag: 'Fungal Rust' },
  { label: 'Powdery Mildew Complex', page: 'plant-health-analysis' as PageId, tag: 'Foliar Pathogen' },
  { label: 'Diagnosis History & Parcel Ledger', page: 'diagnosis-history' as PageId, tag: 'History Log' },
  { label: 'Agro Tips & Irrigation Care', page: 'agro-tips' as PageId, tag: 'Agronomy Guide' },
];

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  currentUser,
  onSwitchRole,
  activeParcel,
  onChangeParcel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [parcelMenuOpen, setParcelMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const parcelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (parcelRef.current && !parcelRef.current.contains(e.target as Node)) {
        setParcelMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      onNavigate('plant-health-analysis');
      setSearchFocused(false);
      return;
    }
    if (q.includes('history') || q.includes('log')) {
      onNavigate('diagnosis-history');
    } else if (q.includes('tip') || q.includes('care') || q.includes('water')) {
      onNavigate('agro-tips');
    } else if (q.includes('admin') && currentUser.role === 'admin') {
      onNavigate('admin-profile');
    } else if (q.includes('profile') || q.includes('account')) {
      onNavigate(currentUser.role === 'admin' ? 'admin-profile' : 'user-profile');
    } else {
      // Requirement 6: When a user searches for Plant Health Analysis (or any disease/symptom), navigate to Plant Health Analysis page
      onNavigate('plant-health-analysis', searchQuery.trim());
    }
    setSearchFocused(false);
  };

  const filteredSuggestions = QUICK_SEARCH_SUGGESTIONS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const navLinkClass = (page: PageId) =>
    activePage === page
      ? 'px-3 py-2 transition-all bg-primary-container text-on-primary font-headline-sm rounded-lg text-sm font-semibold whitespace-nowrap'
      : 'px-3 py-2 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all whitespace-nowrap';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-primary/5">
      <div className="h-20 w-full px-4 sm:px-margin flex items-center justify-between gap-3">
        {/* Left Brand & Online Status */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('scan-crop')}
            className="flex items-center gap-space-sm text-left group focus:outline-none"
          >
            <img
              alt="AgroAI Precision Logo"
              className="h-8 w-8 rounded-lg object-contain flex-shrink-0"
              src={HOTLINKED_ASSETS.logo}
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none font-bold">
                AgroAI
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-0.5">
                Precision Agriculture
              </span>
            </div>
          </button>

          <div className="hidden 2xl:flex items-center gap-space-xs bg-surface-container-low px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-md text-label-md text-secondary">Sensor &amp; AI Engine Online</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          <button
            type="button"
            onClick={() => onNavigate('scan-crop')}
            className={navLinkClass('scan-crop')}
          >
            Home / Scan Crop
          </button>
          <button
            type="button"
            onClick={() => onNavigate('diagnosis-history')}
            className={navLinkClass('diagnosis-history')}
          >
            Diagnosis History
          </button>
          <button
            type="button"
            onClick={() => onNavigate('plant-health-analysis')}
            className={navLinkClass('plant-health-analysis')}
          >
            Plant Health Analysis
          </button>
          <button
            type="button"
            onClick={() => onNavigate('agro-tips')}
            className={navLinkClass('agro-tips')}
          >
            Agro Tips
          </button>
          {currentUser.role === 'user' ? (
            <button
              type="button"
              onClick={() => onNavigate('user-profile')}
              className={navLinkClass('user-profile')}
            >
              User Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('admin-profile')}
              className={navLinkClass('admin-profile')}
            >
              Admin Profile
            </button>
          )}
        </nav>

        {/* Right Controls: Search Bar, Parcel Selector, Role/Profile Menu */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Search Input for Plant Health Analysis */}
          <div ref={searchRef} className="relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-on-surface-variant text-base absolute left-2.5 pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Plant Health Analysis..."
                  aria-label="Search Plant Health Analysis"
                  className="w-44 xl:w-56 bg-surface-container-low text-on-surface font-body-sm text-xs pl-8 pr-7 py-2 rounded-lg border border-transparent focus:border-secondary focus:bg-surface-container-lowest focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}
              </div>
            </form>

            {searchFocused && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-primary/10 py-2 z-50">
                <div className="px-3 py-1.5 flex items-center justify-between border-b border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Pathology &amp; Feature Search
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">Press Enter</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-surface-container/60">
                  {filteredSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.label);
                        onNavigate(item.page, item.label === 'Plant Health Analysis' ? '' : item.label);
                        setSearchFocused(false);
                      }}
                      className="w-full px-3 py-2.5 text-left hover:bg-surface-container-low flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-secondary text-base">biotech</span>
                        <span className="font-body-sm text-xs text-on-surface font-medium truncate">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-label-sm text-[10px] bg-surface-container px-2 py-0.5 rounded text-primary flex-shrink-0">
                        {item.tag}
                      </span>
                    </button>
                  ))}
                  {filteredSuggestions.length === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('plant-health-analysis', searchQuery);
                        setSearchFocused(false);
                      }}
                      className="w-full px-3 py-3 text-left hover:bg-surface-container-low flex items-center gap-2 text-primary font-body-sm text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-base">troubleshoot</span>
                      Analyze symptom &ldquo;{searchQuery}&rdquo; in Plant Health Analysis
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Parcel Dropdown */}
          <div ref={parcelRef} className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setParcelMenuOpen(!parcelMenuOpen)}
              className="flex items-center gap-space-xs bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-secondary text-base leading-none">grass</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                  Active Parcel
                </span>
                <span className="font-label-md text-label-md text-on-surface leading-snug font-medium max-w-[200px] truncate">
                  {activeParcel}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-base leading-none ml-1">
                expand_more
              </span>
            </button>

            {parcelMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-primary/10 py-1.5 z-50">
                <div className="px-3 py-1.5 border-b border-surface-container">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Select Monitored Field Parcel
                  </span>
                </div>
                {PARCEL_OPTIONS.map((parcel) => (
                  <button
                    key={parcel}
                    type="button"
                    onClick={() => {
                      onChangeParcel(parcel);
                      setParcelMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left font-body-sm text-xs flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                      activeParcel === parcel ? 'text-primary font-semibold bg-surface-container-low/60' : 'text-on-surface'
                    }`}
                  >
                    <span className="truncate">{parcel}</span>
                    {activeParcel === parcel && (
                      <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Switcher & Profile Trigger */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-space-sm pl-space-xs py-1 px-2 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div className="hidden sm:flex flex-col text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold leading-tight">
                    {currentUser.organization}
                  </span>
                  <span
                    className={`font-label-sm text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                      currentUser.role === 'admin'
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                  {currentUser.title}
                </span>
              </div>
              <img
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-secondary/40 flex-shrink-0"
                src={currentUser.avatar}
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-primary/10 p-3 z-50 flex flex-col gap-2.5">
                <div className="flex items-center gap-3 pb-2.5 border-b border-surface-container">
                  <img
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    src={currentUser.avatar}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline-sm text-sm text-on-surface font-bold truncate">
                      {currentUser.name}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                {/* Role Switcher (User vs Admin Login Simulation) */}
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Active Login Account Role
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-surface-container-low p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('user');
                        setProfileMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-md font-label-sm text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        currentUser.role === 'user'
                          ? 'bg-surface-container-lowest text-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">person</span>
                      Normal User
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('admin');
                        setProfileMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-md font-label-sm text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        currentUser.role === 'admin'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      Admin Role
                    </button>
                  </div>
                </div>

                {/* Role-Dependent Profile Access */}
                <div className="flex flex-col gap-1 pt-1 border-t border-surface-container">
                  {currentUser.role === 'user' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('user-profile');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left font-body-sm text-xs font-semibold text-primary bg-surface-container-low hover:bg-surface-container flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">badge</span>
                        Open User Profile
                      </span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('admin-profile');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left font-body-sm text-xs font-semibold text-on-primary bg-primary hover:bg-secondary flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">security</span>
                        Open Admin Profile Console
                      </span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] font-body-sm text-on-surface-variant bg-surface-container-low/60 p-2 rounded-lg">
                  {currentUser.role === 'user'
                    ? 'Logged in as Normal User (Agronomist). Switch to Admin Role above to unlock the Administrator Profile.'
                    : `Logged in as ${USER_ACCOUNTS.admin.name}. Full regional administrator privileges active.`}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-primary/10 px-4 py-4 flex flex-col gap-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Plant Health Analysis or symptoms..."
              className="flex-1 bg-surface-container-low text-on-surface font-body-sm text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-primary text-on-primary rounded-lg font-label-md text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('scan-crop');
                setMobileMenuOpen(false);
              }}
              className={navLinkClass('scan-crop')}
            >
              Home / Scan Crop
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('diagnosis-history');
                setMobileMenuOpen(false);
              }}
              className={navLinkClass('diagnosis-history')}
            >
              Diagnosis History
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('plant-health-analysis');
                setMobileMenuOpen(false);
              }}
              className={navLinkClass('plant-health-analysis')}
            >
              Plant Health Analysis
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('agro-tips');
                setMobileMenuOpen(false);
              }}
              className={navLinkClass('agro-tips')}
            >
              Agro Tips
            </button>
            {currentUser.role === 'user' ? (
              <button
                type="button"
                onClick={() => {
                  onNavigate('user-profile');
                  setMobileMenuOpen(false);
                }}
                className={navLinkClass('user-profile')}
              >
                User Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onNavigate('admin-profile');
                  setMobileMenuOpen(false);
                }}
                className={navLinkClass('admin-profile')}
              >
                Admin Profile
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
