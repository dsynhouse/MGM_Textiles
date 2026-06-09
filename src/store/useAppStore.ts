import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type {
  Machine, Beam, ProductionOrder, Employee, ConsumptionLog,
  InventoryItem, DocArticle, Alert, DowntimeEntry, PlantTargets
} from '../types';
import {
  MACHINES, BEAMS, PRODUCTION_ORDERS, EMPLOYEES, CONSUMPTION_LOGS,
  INVENTORY_ITEMS, DOC_ARTICLES, ALERTS, DOWNTIME_ENTRIES
} from '../data/mockData';

interface AppState {
  // Data
  machines: Machine[];
  beams: Beam[];
  orders: ProductionOrder[];
  employees: Employee[];
  consumptionLogs: ConsumptionLog[];
  inventoryItems: InventoryItem[];
  docArticles: DocArticle[];
  alerts: Alert[];
  downtimeEntries: DowntimeEntry[];
  targets: PlantTargets;

  // UI State
  sidebarCollapsed: boolean;
  language: 'en' | 'hi' | 'ur';
  currentUser: Employee;

  // Actions
  toggleSidebar: () => void;
  setLanguage: (lang: 'en' | 'hi' | 'ur') => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  addMachine: (machine: Machine) => void;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  addOrder: (order: ProductionOrder) => void;
  updateOrder: (id: string, updates: Partial<ProductionOrder>) => void;
  addConsumptionLog: (log: ConsumptionLog) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  addDocArticle: (article: DocArticle) => void;
  updateDocArticle: (id: string, updates: Partial<DocArticle>) => void;
  addBeam: (beam: Beam) => void;
  updateBeam: (id: string, updates: Partial<Beam>) => void;
  updateTargets: (updates: Partial<PlantTargets>) => void;
  initializeStore: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial data from mock
  machines: MACHINES,
  beams: BEAMS,
  orders: PRODUCTION_ORDERS,
  employees: EMPLOYEES,
  consumptionLogs: CONSUMPTION_LOGS,
  inventoryItems: INVENTORY_ITEMS,
  docArticles: DOC_ARTICLES,
  alerts: ALERTS,
  downtimeEntries: DOWNTIME_ENTRIES,
  targets: {
    dailyProductionMeters: 50000,
    minimumEfficiencyPercent: 85,
    maxWastagePercent: 3.5,
  },

  // UI State
  sidebarCollapsed: false,
  language: 'en',
  currentUser: EMPLOYEES[0],

  // Actions
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setLanguage: (lang) => set({ language: lang }),
  markAlertRead: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, read: true } : a)
  })),
  markAllAlertsRead: () => set((s) => ({
    alerts: s.alerts.map((a) => ({ ...a, read: true }))
  })),
  addMachine: async (machine) => {
    await supabase.from('machines').insert(machine);
    set((s) => ({ machines: [...s.machines, machine] }));
  },
  updateMachine: async (id, updates) => {
    await supabase.from('machines').update(updates).eq('id', id);
    set((s) => ({
      machines: s.machines.map((m) => m.id === id ? { ...m, ...updates } : m)
    }));
  },
  addOrder: async (order) => {
    await supabase.from('production_orders').insert(order);
    set((s) => ({ orders: [...s.orders, order] }));
  },
  updateOrder: async (id, updates) => {
    await supabase.from('production_orders').update(updates).eq('id', id);
    set((s) => ({
      orders: s.orders.map((o) => o.id === id ? { ...o, ...updates } : o)
    }));
  },
  addConsumptionLog: async (log) => {
    await supabase.from('consumption_logs').insert(log);
    set((s) => ({ consumptionLogs: [...s.consumptionLogs, log] }));
  },
  addInventoryItem: (item) => set((s) => ({ inventoryItems: [...s.inventoryItems, item] })),
  updateInventoryItem: (id, updates) => set((s) => ({
    inventoryItems: s.inventoryItems.map((i) => i.id === id ? { ...i, ...updates } : i)
  })),
  addEmployee: (employee) => set((s) => ({ employees: [...s.employees, employee] })),
  updateEmployee: (id, updates) => set((s) => ({
    employees: s.employees.map((e) => e.id === id ? { ...e, ...updates } : e)
  })),
  addDocArticle: async (article) => {
    await supabase.from('docs').insert(article);
    set((s) => ({ docArticles: [...s.docArticles, article] }));
  },
  updateDocArticle: async (id, updates) => {
    await supabase.from('docs').update(updates).eq('id', id);
    set((s) => ({
      docArticles: s.docArticles.map((d) => d.id === id ? { ...d, ...updates } : d)
    }));
  },
  addBeam: async (beam) => {
    await supabase.from('beams').insert(beam);
    set((s) => ({ beams: [...s.beams, beam] }));
  },
  updateBeam: async (id, updates) => {
    await supabase.from('beams').update(updates).eq('id', id);
    set((s) => ({
      beams: s.beams.map((b) => b.id === id ? { ...b, ...updates } : b)
    }));
  },
  updateTargets: async (updates) => {
    await supabase.from('plant_targets').update(updates).eq('id', 'global');
    set((s) => ({ targets: { ...s.targets, ...updates } }));
  },
  initializeStore: async () => {
    const { data: targetsData } = await supabase.from('plant_targets').select('*').eq('id', 'global').single();
    if (targetsData) {
      set({ targets: targetsData as PlantTargets });
    }
    
    // Fetch docs
    const { data: docsData } = await supabase.from('docs').select('*');
    if (docsData && docsData.length > 0) {
      set({ docArticles: docsData as DocArticle[] });
    }

    // Fetch beams
    const { data: beamsData } = await supabase.from('beams').select('*');
    if (beamsData && beamsData.length > 0) {
      set({ beams: beamsData as Beam[] });
    }

    // Fetch machines
    const { data: machinesData } = await supabase.from('machines').select('*');
    if (machinesData && machinesData.length > 0) {
      set({ machines: machinesData as Machine[] });
    }

    // Fetch orders
    const { data: ordersData } = await supabase.from('production_orders').select('*');
    if (ordersData && ordersData.length > 0) {
      set({ orders: ordersData as ProductionOrder[] });
    }

    // Fetch consumption logs
    const { data: consumptionData } = await supabase.from('consumption_logs').select('*');
    if (consumptionData && consumptionData.length > 0) {
      set({ consumptionLogs: consumptionData as ConsumptionLog[] });
    }
  }
}));
