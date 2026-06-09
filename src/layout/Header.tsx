import React, { useState } from 'react';
import { Bell, Search, Globe, Sun, ChevronDown } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './Header.css';

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  '/':            { title: 'Dashboard',     subtitle: 'Live factory operations overview' },
  '/machines':    { title: 'Machine Registry', subtitle: 'Loom configurations, specs & maintenance' },
  '/production':  { title: 'Production',    subtitle: 'Orders, runs, and beam management' },
  '/consumption': { title: 'Consumption',   subtitle: 'Yarn & material consumption logs' },
  '/efficiency':  { title: 'Efficiency',    subtitle: 'Performance metrics & analysis' },
  '/reports':     { title: 'Reports',       subtitle: 'Auto-generated operational reports' },
  '/people':      { title: 'People',        subtitle: 'Workforce, shifts & attendance' },
  '/inventory':   { title: 'Inventory',     subtitle: 'Stock management & procurement' },
  '/translation': { title: 'Translation',   subtitle: 'Multilingual content & documents' },
  '/docs':        { title: 'Docs Hub',      subtitle: 'SOPs, manuals & knowledge base' },
};

interface HeaderProps { currentPath: string; }

export function Header({ currentPath }: HeaderProps) {
  const { alerts, markAllAlertsRead, language, setLanguage } = useAppStore();
  const unreadCount = alerts.filter((a) => !a.read).length;
  const [showAlerts, setShowAlerts] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const pageInfo = routeTitles[currentPath] ?? { title: 'MGM Textiles ERP', subtitle: '' };

  const langLabels: Record<string, string> = { en: 'English', hi: 'हिन्दी', ur: 'اردو' };

  return (
    <header className="header">
      {/* Page title */}
      <div className="header__title-area">
        <h1 className="header__title">{pageInfo.title}</h1>
        <p className="header__subtitle">{pageInfo.subtitle}</p>
      </div>

      {/* Right side actions */}
      <div className="header__actions">
        {/* Search */}
        <div className="header__search">
          <Search size={15} className="header__search-icon" />
          <input placeholder="Search anything..." />
        </div>

        {/* Language switcher */}
        <div className="header__dropdown-wrapper">
          <button
            className="btn btn--ghost btn--sm header__lang-btn"
            onClick={() => { setShowLang(!showLang); setShowAlerts(false); }}
          >
            <Globe size={15} />
            <span>{langLabels[language]}</span>
            <ChevronDown size={12} />
          </button>
          {showLang && (
            <div className="header__dropdown">
              {(['en', 'hi', 'ur'] as const).map((lang) => (
                <button
                  key={lang}
                  className={`header__dropdown-item ${language === lang ? 'header__dropdown-item--active' : ''}`}
                  onClick={() => { setLanguage(lang); setShowLang(false); }}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts bell */}
        <div className="header__dropdown-wrapper">
          <button
            className="btn btn--ghost btn--icon header__bell"
            onClick={() => { setShowAlerts(!showAlerts); setShowLang(false); }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="header__bell-badge">{unreadCount}</span>
            )}
          </button>
          {showAlerts && (
            <div className="header__dropdown header__dropdown--alerts">
              <div className="header__dropdown-header">
                <span className="fw-semibold">Alerts</span>
                {unreadCount > 0 && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={markAllAlertsRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="header__alerts-list">
                {alerts.slice(0, 6).map((alert) => (
                  <div key={alert.id} className={`header__alert-item ${alert.read ? 'header__alert-item--read' : ''}`}>
                    <span className={`status-dot status-dot--${alert.type === 'danger' ? 'offline' : alert.type === 'warning' ? 'warning' : 'online'}`} />
                    <div>
                      <p className="header__alert-title">{alert.title}</p>
                      <p className="header__alert-msg">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date/Time display */}
        <div className="header__datetime">
          <span className="header__date">
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <span className="header__shift-tag">
            <Sun size={12} />
            Morning Shift
          </span>
        </div>
      </div>
    </header>
  );
}
