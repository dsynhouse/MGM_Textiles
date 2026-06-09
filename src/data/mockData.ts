import type {
  Machine, Beam, ProductionOrder, ProductionRun, ConsumptionLog,
  Employee, AttendanceRecord, InventoryItem, DowntimeEntry, DocArticle, Alert, Shift
} from '../types';

// ============================================================
// MOCK DATA — MGM Textiles ERP
// ============================================================

export const SHIFTS: Shift[] = [
  { id: 'sh1', name: 'Morning', startTime: '06:00', endTime: '14:00', supervisorId: 'e2' },
  { id: 'sh2', name: 'Afternoon', startTime: '14:00', endTime: '22:00', supervisorId: 'e3' },
  { id: 'sh3', name: 'Night', startTime: '22:00', endTime: '06:00', supervisorId: 'e4' },
];

export const EMPLOYEES: Employee[] = [
  { id: 'e1', employeeCode: 'MGM001', name: 'Arjun Mehta', role: 'admin', department: 'Management', shift: 'Morning', phone: '+91 98765 00001', joiningDate: '2018-03-01', status: 'active', salaryBase: 75000, skills: ['ERP', 'Production Planning'], assignedMachineId: null },
  { id: 'e2', employeeCode: 'MGM002', name: 'Rajesh Kumar', role: 'supervisor', department: 'Weaving', shift: 'Morning', phone: '+91 98765 00002', joiningDate: '2019-06-15', status: 'active', salaryBase: 45000, skills: ['Loom Operation', 'Quality Check'], assignedMachineId: null },
  { id: 'e3', employeeCode: 'MGM003', name: 'Priya Singh', role: 'supervisor', department: 'Weaving', shift: 'Afternoon', phone: '+91 98765 00003', joiningDate: '2020-01-10', status: 'active', salaryBase: 45000, skills: ['Loom Operation', 'Efficiency Tracking'], assignedMachineId: null },
  { id: 'e4', employeeCode: 'MGM004', name: 'Mohammed Farooq', role: 'supervisor', department: 'Weaving', shift: 'Night', phone: '+91 98765 00004', joiningDate: '2019-11-20', status: 'active', salaryBase: 46000, skills: ['Loom Operation', 'Maintenance'], assignedMachineId: null },
  { id: 'e5', employeeCode: 'MGM005', name: 'Suresh Patil', role: 'operator', department: 'Weaving', shift: 'Morning', phone: '+91 98765 00005', joiningDate: '2021-03-12', status: 'active', salaryBase: 22000, skills: ['Rapier Loom'], assignedMachineId: 'm1' },
  { id: 'e6', employeeCode: 'MGM006', name: 'Kavitha Reddy', role: 'operator', department: 'Weaving', shift: 'Morning', phone: '+91 98765 00006', joiningDate: '2021-07-08', status: 'active', salaryBase: 21000, skills: ['Airjet Loom'], assignedMachineId: 'm2' },
  { id: 'e7', employeeCode: 'MGM007', name: 'Ramesh Nair', role: 'operator', department: 'Weaving', shift: 'Morning', phone: '+91 98765 00007', joiningDate: '2020-09-05', status: 'active', salaryBase: 23000, skills: ['Rapier Loom', 'Dobby'], assignedMachineId: 'm3' },
  { id: 'e8', employeeCode: 'MGM008', name: 'Anita Sharma', role: 'quality', department: 'Quality', shift: 'Morning', phone: '+91 98765 00008', joiningDate: '2022-01-15', status: 'active', salaryBase: 28000, skills: ['Fabric Testing', 'GSM Check'], assignedMachineId: null },
  { id: 'e9', employeeCode: 'MGM009', name: 'Vinod Tiwari', role: 'maintenance', department: 'Maintenance', shift: 'Morning', phone: '+91 98765 00009', joiningDate: '2019-05-20', status: 'active', salaryBase: 30000, skills: ['Loom Repair', 'Electrical'], assignedMachineId: null },
  { id: 'e10', employeeCode: 'MGM010', name: 'Deepak Joshi', role: 'operator', department: 'Weaving', shift: 'Afternoon', phone: '+91 98765 00010', joiningDate: '2022-06-01', status: 'on-leave', salaryBase: 20000, skills: ['Airjet Loom'], assignedMachineId: 'm4' },
];

export const MACHINES: Machine[] = [
  { id: 'm1', name: 'Loom-01', type: 'rapier', brand: 'Picanol', model: 'GTX-L', year: 2018, hall: 'Hall A', section: 'Section 1', status: 'running', reedCount: 120, reedWidth: 190, picksPerInch: 60, rpmTarget: 600, rpmActual: 587, lastServiceDate: '2026-05-01', nextServiceDate: '2026-08-01', efficiencyTarget: 85, efficiencyActual: 88.2, operatorId: 'e5', currentBeamId: 'b1', notes: 'High-performance rapier loom', createdAt: '2018-01-15' },
  { id: 'm2', name: 'Loom-02', type: 'airjet', brand: 'Toyota', model: 'JAT910', year: 2019, hall: 'Hall A', section: 'Section 1', status: 'running', reedCount: 96, reedWidth: 210, picksPerInch: 72, rpmTarget: 900, rpmActual: 876, lastServiceDate: '2026-04-15', nextServiceDate: '2026-07-15', efficiencyTarget: 88, efficiencyActual: 85.6, operatorId: 'e6', currentBeamId: 'b2', notes: '', createdAt: '2019-03-20' },
  { id: 'm3', name: 'Loom-03', type: 'rapier', brand: 'Picanol', model: 'GTX-L', year: 2018, hall: 'Hall A', section: 'Section 2', status: 'running', reedCount: 120, reedWidth: 190, picksPerInch: 60, rpmTarget: 600, rpmActual: 592, lastServiceDate: '2026-05-10', nextServiceDate: '2026-08-10', efficiencyTarget: 85, efficiencyActual: 91.3, operatorId: 'e7', currentBeamId: 'b3', notes: 'Best performer this month', createdAt: '2018-01-15' },
  { id: 'm4', name: 'Loom-04', type: 'airjet', brand: 'Toyota', model: 'JAT710', year: 2017, hall: 'Hall A', section: 'Section 2', status: 'maintenance', reedCount: 96, reedWidth: 190, picksPerInch: 68, rpmTarget: 850, rpmActual: 0, lastServiceDate: '2026-06-08', nextServiceDate: '2026-09-08', efficiencyTarget: 85, efficiencyActual: 0, operatorId: 'e10', currentBeamId: null, notes: 'Under scheduled maintenance', createdAt: '2017-06-10' },
  { id: 'm5', name: 'Loom-05', type: 'dobby', brand: 'Sulzer', model: 'P7200', year: 2020, hall: 'Hall B', section: 'Section 1', status: 'running', reedCount: 140, reedWidth: 220, picksPerInch: 54, rpmTarget: 550, rpmActual: 541, lastServiceDate: '2026-03-20', nextServiceDate: '2026-06-20', efficiencyTarget: 82, efficiencyActual: 79.8, operatorId: null, currentBeamId: 'b5', notes: 'Dobby pattern loom', createdAt: '2020-02-05' },
  { id: 'm6', name: 'Loom-06', type: 'rapier', brand: 'Picanol', model: 'Optimax-i', year: 2022, hall: 'Hall B', section: 'Section 1', status: 'running', reedCount: 128, reedWidth: 200, picksPerInch: 64, rpmTarget: 650, rpmActual: 638, lastServiceDate: '2026-05-25', nextServiceDate: '2026-08-25', efficiencyTarget: 90, efficiencyActual: 92.1, operatorId: null, currentBeamId: 'b6', notes: 'Newest machine — flagship', createdAt: '2022-11-01' },
  { id: 'm7', name: 'Loom-07', type: 'airjet', brand: 'Toyota', model: 'JAT910', year: 2021, hall: 'Hall B', section: 'Section 2', status: 'breakdown', reedCount: 96, reedWidth: 210, picksPerInch: 72, rpmTarget: 900, rpmActual: 0, lastServiceDate: '2026-01-10', nextServiceDate: '2026-04-10', efficiencyTarget: 88, efficiencyActual: 0, operatorId: null, currentBeamId: null, notes: 'Reed damaged — repair pending', createdAt: '2021-07-15' },
  { id: 'm8', name: 'Loom-08', type: 'projectile', brand: 'Sulzer', model: 'TW11', year: 2015, hall: 'Hall C', section: 'Section 1', status: 'idle', reedCount: 110, reedWidth: 180, picksPerInch: 56, rpmTarget: 500, rpmActual: 0, lastServiceDate: '2026-04-01', nextServiceDate: '2026-07-01', efficiencyTarget: 80, efficiencyActual: 0, operatorId: null, currentBeamId: null, notes: 'Awaiting new order assignment', createdAt: '2015-09-20' },
];

export const BEAMS: Beam[] = [
  { id: 'b1', beamNumber: 'BM-2026-001', articleCode: 'ART-100', yarnCount: '30s Ne', yarnType: 'Cotton Combed', warpEnds: 3840, beamWeight: 680, theoreticalMeters: 1200, actualMeters: 847, status: 'in-progress', machineId: 'm1', orderId: 'po1', createdAt: '2026-06-01', completedAt: null },
  { id: 'b2', beamNumber: 'BM-2026-002', articleCode: 'ART-101', yarnCount: '40s Ne', yarnType: 'Cotton Carded', warpEnds: 4096, beamWeight: 520, theoreticalMeters: 980, actualMeters: 310, status: 'in-progress', machineId: 'm2', orderId: 'po2', createdAt: '2026-06-03', completedAt: null },
  { id: 'b3', beamNumber: 'BM-2026-003', articleCode: 'ART-100', yarnCount: '30s Ne', yarnType: 'Cotton Combed', warpEnds: 3840, beamWeight: 680, theoreticalMeters: 1200, actualMeters: 1200, status: 'completed', machineId: 'm3', orderId: 'po1', createdAt: '2026-05-20', completedAt: '2026-06-05' },
  { id: 'b4', beamNumber: 'BM-2026-004', articleCode: 'ART-102', yarnCount: '20s Ne', yarnType: 'Polyester Blend', warpEnds: 3200, beamWeight: 820, theoreticalMeters: 1500, actualMeters: 0, status: 'standby', machineId: null, orderId: 'po3', createdAt: '2026-06-07', completedAt: null },
  { id: 'b5', beamNumber: 'BM-2026-005', articleCode: 'ART-103', yarnCount: '60s Ne', yarnType: 'Cotton Combed', warpEnds: 5120, beamWeight: 420, theoreticalMeters: 800, actualMeters: 430, status: 'in-progress', machineId: 'm5', orderId: 'po4', createdAt: '2026-06-04', completedAt: null },
  { id: 'b6', beamNumber: 'BM-2026-006', articleCode: 'ART-104', yarnCount: '40s Ne', yarnType: 'Linen Blend', warpEnds: 4096, beamWeight: 560, theoreticalMeters: 1100, actualMeters: 650, status: 'in-progress', machineId: 'm6', orderId: 'po5', createdAt: '2026-06-05', completedAt: null },
];

export const PRODUCTION_ORDERS: ProductionOrder[] = [
  { id: 'po1', orderNumber: 'ORD-2026-001', customerName: 'Textrade Corp', articleCode: 'ART-100', fabricType: 'Plain Weave', width: 190, gsm: 120, color: 'Natural White', quantityOrdered: 5000, quantityProduced: 2847, status: 'active', startDate: '2026-05-20', dueDate: '2026-06-30', assignedMachines: ['m1', 'm3'], beamIds: ['b1', 'b3'], notes: 'Priority order', createdAt: '2026-05-18' },
  { id: 'po2', orderNumber: 'ORD-2026-002', customerName: 'FabricHub Ltd', articleCode: 'ART-101', fabricType: 'Twill Weave', width: 210, gsm: 150, color: 'Off White', quantityOrdered: 3000, quantityProduced: 310, status: 'active', startDate: '2026-06-03', dueDate: '2026-07-15', assignedMachines: ['m2'], beamIds: ['b2'], notes: '', createdAt: '2026-06-01' },
  { id: 'po3', orderNumber: 'ORD-2026-003', customerName: 'Garment Masters', articleCode: 'ART-102', fabricType: 'Satin Weave', width: 180, gsm: 200, color: 'Midnight Blue', quantityOrdered: 2000, quantityProduced: 0, status: 'pending', startDate: '2026-06-15', dueDate: '2026-07-31', assignedMachines: [], beamIds: ['b4'], notes: 'Dye lot confirmation pending', createdAt: '2026-06-07' },
  { id: 'po4', orderNumber: 'ORD-2026-004', customerName: 'StyleWorks India', articleCode: 'ART-103', fabricType: 'Dobby Weave', width: 220, gsm: 180, color: 'Ecru', quantityOrdered: 1500, quantityProduced: 430, status: 'active', startDate: '2026-06-04', dueDate: '2026-06-28', assignedMachines: ['m5'], beamIds: ['b5'], notes: 'Urgent — rush order', createdAt: '2026-06-02' },
  { id: 'po5', orderNumber: 'ORD-2026-005', customerName: 'Euro Fashion GmbH', articleCode: 'ART-104', fabricType: 'Plain Weave', width: 200, gsm: 130, color: 'Stone Grey', quantityOrdered: 8000, quantityProduced: 650, status: 'active', startDate: '2026-06-05', dueDate: '2026-08-15', assignedMachines: ['m6'], beamIds: ['b6'], notes: 'Export order', createdAt: '2026-06-03' },
  { id: 'po6', orderNumber: 'ORD-2026-006', customerName: 'Local Mart Co.', articleCode: 'ART-105', fabricType: 'Rib Weave', width: 150, gsm: 90, color: 'White', quantityOrdered: 1000, quantityProduced: 1000, status: 'completed', startDate: '2026-05-01', dueDate: '2026-05-31', assignedMachines: ['m8'], beamIds: [], notes: '', createdAt: '2026-04-28' },
];

export const CONSUMPTION_LOGS: ConsumptionLog[] = [
  { id: 'cl1', date: '2026-06-09', machineId: 'm1', orderId: 'po1', beamId: 'b1', shiftId: 'sh1', warpConsumed: 48.2, weftConsumed: 32.1, standardConsumption: 78.0, wastage: 2.3, batchNumber: 'BATCH-001', createdAt: '2026-06-09T06:00:00Z' },
  { id: 'cl2', date: '2026-06-09', machineId: 'm2', orderId: 'po2', beamId: 'b2', shiftId: 'sh1', warpConsumed: 38.5, weftConsumed: 28.4, standardConsumption: 65.0, wastage: 1.6, batchNumber: 'BATCH-002', createdAt: '2026-06-09T06:00:00Z' },
  { id: 'cl3', date: '2026-06-09', machineId: 'm3', orderId: 'po1', beamId: 'b1', shiftId: 'sh1', warpConsumed: 50.1, weftConsumed: 33.8, standardConsumption: 78.0, wastage: 5.9, batchNumber: 'BATCH-001', createdAt: '2026-06-09T06:00:00Z' },
  { id: 'cl4', date: '2026-06-08', machineId: 'm1', orderId: 'po1', beamId: 'b1', shiftId: 'sh2', warpConsumed: 46.8, weftConsumed: 31.2, standardConsumption: 78.0, wastage: 1.8, batchNumber: 'BATCH-001', createdAt: '2026-06-08T14:00:00Z' },
  { id: 'cl5', date: '2026-06-08', machineId: 'm5', orderId: 'po4', beamId: 'b5', shiftId: 'sh1', warpConsumed: 35.0, weftConsumed: 27.5, standardConsumption: 60.0, wastage: 2.5, batchNumber: 'BATCH-003', createdAt: '2026-06-08T06:00:00Z' },
  { id: 'cl6', date: '2026-06-08', machineId: 'm6', orderId: 'po5', beamId: 'b6', shiftId: 'sh1', warpConsumed: 52.3, weftConsumed: 38.1, standardConsumption: 88.0, wastage: 2.1, batchNumber: 'BATCH-004', createdAt: '2026-06-08T06:00:00Z' },
];

export const DOWNTIME_ENTRIES: DowntimeEntry[] = [
  { id: 'd1', machineId: 'm7', date: '2026-06-08', shiftId: 'sh2', startTime: '15:30', endTime: '23:59', durationMinutes: 510, cause: 'Reed wire breakage — awaiting spare', category: 'breakdown', resolvedBy: '', notes: 'Reed ordered from Picanol' },
  { id: 'd2', machineId: 'm4', date: '2026-06-09', shiftId: 'sh1', startTime: '06:00', endTime: '14:00', durationMinutes: 480, cause: 'Scheduled preventive maintenance', category: 'planned', resolvedBy: 'e9', notes: 'Cam shaft lubrication and nozzle cleaning' },
  { id: 'd3', machineId: 'm1', date: '2026-06-09', shiftId: 'sh1', startTime: '08:15', endTime: '08:45', durationMinutes: 30, cause: 'Warp breakage — end-finding', category: 'material', resolvedBy: 'e5', notes: '' },
  { id: 'd4', machineId: 'm2', date: '2026-06-08', shiftId: 'sh3', startTime: '02:00', endTime: '02:40', durationMinutes: 40, cause: 'Power fluctuation', category: 'power', resolvedBy: 'e3', notes: 'UPS needs calibration' },
];

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'inv1', code: 'YRN-001', name: '30s Ne Cotton Combed', category: 'yarn', unit: 'kg', currentStock: 4850, minimumStock: 1000, unitCost: 185, supplierId: null, location: 'Warehouse A, Bay 1', lastUpdated: '2026-06-09' },
  { id: 'inv2', code: 'YRN-002', name: '40s Ne Cotton Carded', category: 'yarn', unit: 'kg', currentStock: 2100, minimumStock: 800, unitCost: 165, supplierId: null, location: 'Warehouse A, Bay 2', lastUpdated: '2026-06-08' },
  { id: 'inv3', code: 'YRN-003', name: '20s Ne Polyester Blend', category: 'yarn', unit: 'kg', currentStock: 680, minimumStock: 500, unitCost: 140, supplierId: null, location: 'Warehouse A, Bay 3', lastUpdated: '2026-06-07' },
  { id: 'inv4', code: 'YRN-004', name: '60s Ne Cotton Combed', category: 'yarn', unit: 'kg', currentStock: 320, minimumStock: 400, unitCost: 260, supplierId: null, location: 'Warehouse B, Bay 1', lastUpdated: '2026-06-09' },
  { id: 'inv5', code: 'DYE-001', name: 'Reactive Blue RB-200', category: 'dye', unit: 'kg', currentStock: 48, minimumStock: 20, unitCost: 1200, supplierId: null, location: 'Chemical Store', lastUpdated: '2026-06-05' },
  { id: 'inv6', code: 'SPR-001', name: 'Reed Wire 120/190cm', category: 'spare-part', unit: 'pcs', currentStock: 4, minimumStock: 10, unitCost: 8500, supplierId: null, location: 'Maintenance Store', lastUpdated: '2026-06-08' },
  { id: 'inv7', code: 'CHM-001', name: 'Sizing Chemical (PVA)', category: 'chemical', unit: 'kg', currentStock: 920, minimumStock: 200, unitCost: 95, supplierId: null, location: 'Chemical Store', lastUpdated: '2026-06-06' },
];

export const DOC_ARTICLES: DocArticle[] = [
  { id: 'doc1', title: 'Loom Startup & Shutdown Procedure', category: 'sop', content: '# Loom Startup Procedure\n\n## Pre-Startup Checks\n1. Inspect reed for damage\n2. Check oil levels\n3. Verify warp tension is within ±5% of target\n4. Check let-off and take-up motions\n\n## Startup Sequence\n1. Turn on main power\n2. Set RPM to 50% (slow run)\n3. Run for 2 minutes — observe for abnormalities\n4. Gradually increase to target RPM\n\n## Shutdown\n1. Reduce RPM to 50%\n2. Stop at fell position\n3. Turn off power\n4. Record meter reading in log', tags: ['loom', 'startup', 'safety'], author: 'Rajesh Kumar', version: 3, createdAt: '2024-01-10', updatedAt: '2026-05-15' },
  { id: 'doc2', title: 'Warp Beam Loading Guide', category: 'machine-manual', content: '# Warp Beam Loading\n\nThis guide covers the procedure for loading a new warp beam onto the loom.\n\n## Required Tools\n- Beam trolley\n- Warp threading hook\n- Tension gauge\n\n## Steps\n1. Verify beam number matches production order\n2. Use trolley to position beam at rear of loom\n3. Secure beam flanges\n4. Thread warp ends through heddles and reed\n5. Set initial warp tension as per article spec', tags: ['beam', 'warp', 'loom-setup'], author: 'Arjun Mehta', version: 2, createdAt: '2024-03-05', updatedAt: '2025-11-20' },
  { id: 'doc3', title: 'Quality Defect Classification Standard', category: 'quality', content: '# Fabric Defect Classification\n\n| Defect | Code | Action |\n|--------|------|--------|\n| Broken end | DE-01 | Stop, repair, log |\n| Mispick | DE-02 | Continue, log count |\n| Fly contamination | DE-03 | Mark for cutting |\n| Reed mark | DE-04 | Maintenance call |', tags: ['quality', 'defects', 'classification'], author: 'Anita Sharma', version: 1, createdAt: '2025-01-15', updatedAt: '2025-01-15' },
];

export const ALERTS: Alert[] = [
  { id: 'al1', type: 'danger', title: 'Machine Breakdown', message: 'Loom-07 (Hall B) has been down for 18 hours. Reed repair pending.', timestamp: '2026-06-08T15:30:00Z', read: false },
  { id: 'al2', type: 'warning', title: 'Low Stock Alert', message: '60s Ne Cotton Combed stock (320 kg) is below minimum level (400 kg).', timestamp: '2026-06-09T06:00:00Z', read: false },
  { id: 'al3', type: 'warning', title: 'Low Stock Alert', message: 'Reed Wire 120/190cm stock (4 pcs) is critically low. Minimum: 10 pcs.', timestamp: '2026-06-09T06:00:00Z', read: false },
  { id: 'al4', type: 'warning', title: 'Service Due', message: 'Loom-05 service is overdue (due 2026-06-20). Schedule maintenance.', timestamp: '2026-06-09T08:00:00Z', read: true },
  { id: 'al5', type: 'info', title: 'Order Milestone', message: 'ORD-2026-001 has reached 56.9% completion (2,847 / 5,000 m).', timestamp: '2026-06-09T09:00:00Z', read: true },
  { id: 'al6', type: 'success', title: 'Beam Completed', message: 'Beam BM-2026-003 completed on Loom-03. Actual: 1,200m / 1,200m.', timestamp: '2026-06-05T18:30:00Z', read: true },
];

export const ATTENDANCE: AttendanceRecord[] = [
  { id: 'att1', employeeId: 'e2', date: '2026-06-09', checkIn: '05:55', checkOut: '14:05', status: 'present', overtimeHours: 0 },
  { id: 'att2', employeeId: 'e5', date: '2026-06-09', checkIn: '06:10', checkOut: '14:00', status: 'late', overtimeHours: 0 },
  { id: 'att3', employeeId: 'e6', date: '2026-06-09', checkIn: '05:58', checkOut: '14:00', status: 'present', overtimeHours: 0 },
  { id: 'att4', employeeId: 'e7', date: '2026-06-09', checkIn: '06:00', checkOut: '14:30', status: 'present', overtimeHours: 0.5 },
  { id: 'att5', employeeId: 'e8', date: '2026-06-09', checkIn: '06:00', checkOut: '14:00', status: 'present', overtimeHours: 0 },
  { id: 'att6', employeeId: 'e9', date: '2026-06-09', checkIn: '06:00', checkOut: '14:00', status: 'present', overtimeHours: 0 },
  { id: 'att7', employeeId: 'e10', date: '2026-06-09', checkIn: '', checkOut: '', status: 'absent', overtimeHours: 0 },
];

// Efficiency trend for last 7 days
export const EFFICIENCY_TREND = [
  { date: 'Jun 3', efficiency: 84.2, target: 85 },
  { date: 'Jun 4', efficiency: 86.1, target: 85 },
  { date: 'Jun 5', efficiency: 87.4, target: 85 },
  { date: 'Jun 6', efficiency: 83.8, target: 85 },
  { date: 'Jun 7', efficiency: 88.2, target: 85 },
  { date: 'Jun 8', efficiency: 85.9, target: 85 },
  { date: 'Jun 9', efficiency: 87.3, target: 85 },
];

// Production output for last 30 days (weekly summary)
export const PRODUCTION_TREND = [
  { week: 'W1 May', actual: 12450, target: 14000 },
  { week: 'W2 May', actual: 13820, target: 14000 },
  { week: 'W3 May', actual: 14200, target: 14000 },
  { week: 'W4 May', actual: 13100, target: 14000 },
  { week: 'W1 Jun', actual: 14600, target: 14000 },
  { week: 'W2 Jun', actual: 5200,  target: 14000 },  // current partial week
];

export const DOWNTIME_BY_CAUSE = [
  { cause: 'Breakdown', minutes: 600, color: '#f43f5e' },
  { cause: 'Material', minutes: 180, color: '#f59e0b' },
  { cause: 'Planned Maint.', minutes: 480, color: '#3b82f6' },
  { cause: 'Power', minutes: 80, color: '#8b5cf6' },
  { cause: 'Setup', minutes: 120, color: '#10b981' },
];
