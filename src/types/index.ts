// ============================================================
// MGM TEXTILES ERP — Core Type Definitions
// ============================================================

// --- Machine / Loom Types ---
export type MachineStatus = 'running' | 'idle' | 'maintenance' | 'breakdown';
export type MachineType = 'rapier' | 'projectile' | 'airjet' | 'waterjet' | 'gripper' | 'dobby';

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
  brand: string;
  model: string;
  year: number;
  hall: string;
  section: string;
  status: MachineStatus;
  reedCount: number;
  reedWidth: number; // cm
  picksPerInch: number;
  rpmTarget: number;
  rpmActual: number;
  lastServiceDate: string;
  nextServiceDate: string;
  efficiencyTarget: number; // %
  efficiencyActual: number; // %
  operatorId: string | null;
  currentBeamId: string | null;
  notes: string;
  createdAt: string;
}

// --- Beam Types ---
export type BeamStatus = 'loaded' | 'in-progress' | 'completed' | 'standby';

export interface Beam {
  id: string;
  beamNumber: string;
  articleCode: string;
  yarnCount: string; // e.g. "30s Ne"
  yarnType: string;
  warpEnds: number;
  beamWeight: number; // kg
  theoreticalMeters: number;
  actualMeters: number;
  status: BeamStatus;
  machineId: string | null;
  orderId: string | null;
  createdAt: string;
  completedAt: string | null;
}

// --- Production Types ---
export type OrderStatus = 'pending' | 'active' | 'completed' | 'on-hold' | 'cancelled';

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  articleCode: string;
  fabricType: string;
  width: number; // cm
  gsm: number;
  color: string;
  quantityOrdered: number; // meters
  quantityProduced: number; // meters
  status: OrderStatus;
  startDate: string;
  dueDate: string;
  assignedMachines: string[];
  beamIds: string[];
  notes: string;
  createdAt: string;
}

export interface ProductionRun {
  id: string;
  machineId: string;
  orderId: string;
  beamId: string;
  shiftId: string;
  operatorId: string;
  date: string;
  picksProduced: number;
  metersProduced: number;
  downtimeMinutes: number;
  downtimeCause: string;
  defects: number;
  efficiency: number; // %
  notes: string;
  createdAt: string;
}

// --- Consumption Types ---
export interface ConsumptionLog {
  id: string;
  date: string;
  machineId: string;
  orderId: string;
  beamId: string;
  shiftId: string;
  warpConsumed: number; // kg
  weftConsumed: number; // kg
  standardConsumption: number; // kg
  wastage: number; // kg
  batchNumber: string;
  createdAt: string;
}

// --- Shift Types ---
export interface Shift {
  id: string;
  name: string;
  startTime: string; // "06:00"
  endTime: string;   // "14:00"
  supervisorId: string | null;
}

// --- Employee Types ---
export type EmployeeRole = 'admin' | 'supervisor' | 'operator' | 'helper' | 'quality' | 'maintenance' | 'viewer';
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  role: EmployeeRole;
  department: string;
  shift: string;
  phone: string;
  joiningDate: string;
  status: EmployeeStatus;
  salaryBase: number;
  skills: string[];
  assignedMachineId: string | null;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday';
  overtimeHours: number;
}

// --- Inventory Types ---
export type StockMovementType = 'in' | 'out' | 'adjustment';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'yarn' | 'dye' | 'chemical' | 'accessory' | 'spare-part';
  unit: string;
  currentStock: number;
  minimumStock: number;
  unitCost: number;
  supplierId: string | null;
  location: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: StockMovementType;
  quantity: number;
  date: string;
  reference: string;
  notes: string;
  createdBy: string;
}

// --- Downtime Types ---
export interface DowntimeEntry {
  id: string;
  machineId: string;
  date: string;
  shiftId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  cause: string;
  category: 'breakdown' | 'power' | 'material' | 'setup' | 'planned' | 'other';
  resolvedBy: string;
  notes: string;
}

// --- Docs Types ---
export type DocCategory = 'sop' | 'machine-manual' | 'quality' | 'training' | 'policy' | 'general';

export interface DocArticle {
  id: string;
  title: string;
  category: DocCategory;
  content: string;
  tags: string[];
  author: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// --- App State Types ---
export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PlantTargets {
  dailyProductionMeters: number;
  minimumEfficiencyPercent: number;
  maxWastagePercent: number;
}
