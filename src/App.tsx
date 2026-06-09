import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { Dashboard } from './modules/dashboard/Dashboard';
import { MachineRegistry } from './modules/machines/MachineRegistry';
import { Production } from './modules/production/Production';
import { Consumption } from './modules/consumption/Consumption';
import { Efficiency } from './modules/efficiency/Efficiency';
import { Reports } from './modules/reports/Reports';
import { People } from './modules/people/People';
import { Inventory } from './modules/inventory/Inventory';
import { Targets } from './modules/targets/Targets';
import { Translation } from './modules/translation/Translation';
import { DocsHub } from './modules/docs/DocsHub';
import { StandardsEngine } from './modules/standards/Standards';
import { useAppStore } from './store/useAppStore';
import './modules/docs/DocsHub.css';

function AppShell() {
  const location = useLocation();
  const { sidebarCollapsed, initializeStore } = useAppStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header currentPath={location.pathname} />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/machines"    element={<MachineRegistry />} />
            <Route path="/production"  element={<Production />} />
            <Route path="/consumption" element={<Consumption />} />
            <Route path="/efficiency"  element={<Efficiency />} />
            <Route path="/reports"     element={<Reports />} />
            <Route path="/people"      element={<People />} />
            <Route path="/inventory"   element={<Inventory />} />
            <Route path="/targets"     element={<Targets />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/docs"        element={<DocsHub />} />
            <Route path="/standards"   element={<StandardsEngine />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
