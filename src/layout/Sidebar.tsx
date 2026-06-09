import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Settings2, Factory, Package, BarChart3,
  FileText, Users, Warehouse, Globe, BookOpen, ChevronLeft,
  ChevronRight, Zap, Bell, TrendingUp, Calculator, Target
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import './Sidebar.css';

const navItems = [
  { path: '/',            icon: LayoutDashboard, label: 'Dashboard',    group: 'main' },
  { path: '/machines',    icon: Settings2,        label: 'Machines',     group: 'operations' },
  { path: '/production',  icon: Factory,          label: 'Production',   group: 'operations' },
  { path: '/consumption', icon: Package,          label: 'Consumption',  group: 'operations' },
  { path: '/efficiency',  icon: TrendingUp,       label: 'Efficiency',   group: 'operations' },
  { path: '/reports',     icon: BarChart3,        label: 'Reports',      group: 'analytics' },
  { path: '/people',      icon: Users,            label: 'People',       group: 'management' },
  { path: '/inventory',   icon: Warehouse,        label: 'Inventory',    group: 'management' },
  { path: '/targets',     icon: Target,           label: 'Plant Targets',group: 'management' },
  { path: '/translation', icon: Globe,            label: 'Translation',  group: 'tools' },
  { path: '/docs',        icon: BookOpen,         label: 'Docs Hub',     group: 'tools' },
  { path: '/standards',   icon: Calculator,       label: 'Standards',    group: 'tools' },
];

const groupLabels: Record<string, string> = {
  main: 'Overview',
  operations: 'Operations',
  analytics: 'Analytics',
  management: 'Management',
  tools: 'Tools',
};

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, alerts } = useAppStore();
  const unreadCount = alerts.filter((a) => !a.read).length;
  const location = useLocation();

  const groups = ['main', 'operations', 'analytics', 'management', 'tools'];

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Zap size={20} />
        </div>
        {!sidebarCollapsed && (
          <div className="sidebar__logo-text">
            <span className="sidebar__logo-brand">MGM</span>
            <span className="sidebar__logo-sub">Textiles ERP</span>
          </div>
        )}
        <button
          className="sidebar__collapse-btn"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {groups.map((group) => {
          const items = navItems.filter((i) => i.group === group);
          return (
            <div key={group} className="sidebar__nav-group">
              {!sidebarCollapsed && (
                <span className="sidebar__nav-group-label">{groupLabels[group]}</span>
              )}
              {items.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
                  }
                  title={sidebarCollapsed ? label : undefined}
                >
                  <span className="sidebar__nav-icon">
                    <Icon size={18} />
                  </span>
                  {!sidebarCollapsed && (
                    <span className="sidebar__nav-label">{label}</span>
                  )}
                  {label === 'Dashboard' && unreadCount > 0 && (
                    <span className="sidebar__badge">{unreadCount}</span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom user info */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">AM</div>
          {!sidebarCollapsed && (
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">Arjun Mehta</span>
              <span className="sidebar__user-role">Administrator</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
