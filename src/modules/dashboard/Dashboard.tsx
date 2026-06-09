import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Activity, AlertTriangle, CheckCircle, Clock, TrendingUp,
  TrendingDown, Zap, Package, Users, Factory, ArrowUpRight,
  ArrowDownRight, Gauge, AlertCircle, Minus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Machine, MachineStatus } from '../../types';
import { EFFICIENCY_TREND, PRODUCTION_TREND, DOWNTIME_BY_CAUSE } from '../../data/mockData';
import './Dashboard.css';

// Animated count-up hook
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function KpiCard({
  label, value, unit, icon: Icon, color, trend, trendValue, trendLabel
}: {
  label: string; value: number | string; unit?: string;
  icon: React.ElementType; color: string;
  trend?: 'up' | 'down' | 'flat'; trendValue?: string; trendLabel?: string;
}) {
  const numVal = typeof value === 'number' ? value : parseFloat(value as string);
  const displayVal = useCountUp(isNaN(numVal) ? 0 : numVal);

  return (
    <div className="kpi-card animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="kpi-card__icon" style={{ background: color + '22', color }}>
          <Icon size={20} />
        </div>
        {trend && trendValue && (
          <span className={`kpi-card__trend kpi-card__trend--${trend}`}>
            {trend === 'up' ? <ArrowUpRight size={13} /> : trend === 'down' ? <ArrowDownRight size={13} /> : <Minus size={13} />}
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <div className="kpi-card__value" style={{ color }}>
          {typeof value === 'string' && isNaN(numVal)
            ? value
            : displayVal.toLocaleString()}
          {unit && <span style={{ fontSize: '0.6em', fontWeight: 400, opacity: 0.7, marginLeft: 4 }}>{unit}</span>}
        </div>
        <div className="kpi-card__label">{label}</div>
        {trendLabel && <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{trendLabel}</div>}
      </div>
    </div>
  );
}

function MachineHeatmapCell({ machine }: { machine: Machine }) {
  const statusColors: Record<MachineStatus, string> = {
    running:     'var(--color-emerald-500)',
    idle:        'var(--color-navy-400)',
    maintenance: 'var(--color-amber-500)',
    breakdown:   'var(--color-rose-500)',
  };
  const color = statusColors[machine.status];

  return (
    <div className="heatmap-cell" title={`${machine.name} — ${machine.status} (${machine.efficiencyActual}%)`}>
      <div className="heatmap-cell__indicator" style={{ background: color }} />
      <div className="heatmap-cell__name">{machine.name}</div>
      <div className="heatmap-cell__eff" style={{ color }}>
        {machine.status === 'running' ? `${machine.efficiencyActual}%` : machine.status}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="chart-tooltip__value" style={{ color: p.color }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
          {p.name?.includes('fficiency') ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export function Dashboard() {
  const { machines, orders, alerts, employees, consumptionLogs } = useAppStore();

  // Compute live stats
  const runningMachines  = machines.filter((m) => m.status === 'running').length;
  const breakdownMachines = machines.filter((m) => m.status === 'breakdown').length;
  const activeOrders     = orders.filter((o) => o.status === 'active').length;
  const avgEfficiency    = machines
    .filter((m) => m.status === 'running')
    .reduce((sum, m) => sum + m.efficiencyActual, 0) / runningMachines;
  const totalProduced    = orders.reduce((s, o) => s + o.quantityProduced, 0);
  const activeEmployees  = employees.filter((e) => e.status === 'active').length;
  const unreadAlerts     = alerts.filter((a) => !a.read);

  const todayConsumption = consumptionLogs
    .filter((c) => c.date === '2026-06-09')
    .reduce((s, c) => s + c.warpConsumed + c.weftConsumed, 0);

  return (
    <div className="page-content dashboard">
      {/* Alert banner */}
      {unreadAlerts.length > 0 && (
        <div className="dashboard__alert-banner animate-fade-in">
          <AlertCircle size={16} />
          <span>
            <strong>{unreadAlerts.length} unread alert{unreadAlerts.length > 1 ? 's' : ''}</strong> —&nbsp;
            {unreadAlerts[0]?.message}
          </span>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid-kpi mb-8">
        <KpiCard
          label="Running Looms"
          value={runningMachines}
          icon={Activity}
          color="var(--color-emerald-500)"
          trend="flat"
          trendValue={`${machines.length} total`}
          trendLabel="2 in maintenance/breakdown"
        />
        <KpiCard
          label="Avg. Efficiency"
          value={parseFloat(avgEfficiency.toFixed(1))}
          unit="%"
          icon={Gauge}
          color="var(--color-amber-500)"
          trend="up"
          trendValue="+2.1%"
          trendLabel="vs. yesterday's 85.2%"
        />
        <KpiCard
          label="Total Output Today"
          value={1847}
          unit="m"
          icon={Factory}
          color="var(--color-blue-500)"
          trend="up"
          trendValue="+12%"
          trendLabel="vs. daily target 2,000m"
        />
        <KpiCard
          label="Active Orders"
          value={activeOrders}
          icon={Package}
          color="var(--color-violet-500)"
          trend="flat"
          trendValue={`${orders.length} total`}
          trendLabel="1 pending, 1 completed"
        />
        <KpiCard
          label="Yarn Consumed Today"
          value={parseFloat(todayConsumption.toFixed(0))}
          unit="kg"
          icon={Zap}
          color="var(--color-orange-500)"
          trend="down"
          trendValue="-4%"
          trendLabel="Less wastage vs. std"
        />
        <KpiCard
          label="Active Workforce"
          value={activeEmployees}
          icon={Users}
          color="var(--color-emerald-400)"
          trend="flat"
          trendValue="3 shifts"
          trendLabel="1 on leave today"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-8">
        {/* Efficiency Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="fw-semibold">Loom Efficiency Trend</h3>
              <p className="text-sm text-secondary">Last 7 days vs. target</p>
            </div>
            <span className="badge badge--success">85% Target</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={EFFICIENCY_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-amber-500)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-amber-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[78, 95]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="efficiency" name="Efficiency" stroke="var(--color-amber-500)" strokeWidth={2} fill="url(#effGrad)" />
              <Area type="monotone" dataKey="target" name="Target" stroke="var(--border-strong)" strokeWidth={1} strokeDasharray="4 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Production Output */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="fw-semibold">Production Output</h3>
              <p className="text-sm text-secondary">Weekly actual vs. target (meters)</p>
            </div>
            <span className="badge badge--info">14,000m/wk Target</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PRODUCTION_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="actual" name="Actual" fill="var(--color-amber-500)" radius={[4,4,0,0]} />
              <Bar dataKey="target" name="Target" fill="var(--border-default)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Machine Heatmap + Downtime + Alerts */}
      <div className="dashboard__bottom-row">
        {/* Machine Status Heatmap */}
        <div className="card dashboard__heatmap-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="fw-semibold">Machine Status Grid</h3>
              <p className="text-sm text-secondary">Real-time loom status overview</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'Running', color: 'var(--color-emerald-500)' },
                { label: 'Idle', color: 'var(--color-navy-400)' },
                { label: 'Maint.', color: 'var(--color-amber-500)' },
                { label: 'Down', color: 'var(--color-rose-500)' },
              ].map(({ label, color }) => (
                <span key={label} className="heatmap-legend">
                  <span className="status-dot" style={{ background: color }} />
                  <span className="text-xs text-secondary">{label}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="heatmap-grid">
            {machines.map((m) => <MachineHeatmapCell key={m.id} machine={m} />)}
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard__right-col">
          {/* Downtime breakdown */}
          <div className="card mb-4">
            <h3 className="fw-semibold mb-4">Downtime by Cause</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={DOWNTIME_BY_CAUSE}
                  cx="40%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  dataKey="minutes"
                  nameKey="cause"
                >
                  {DOWNTIME_BY_CAUSE.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${v} min`, 'Duration']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Active Orders summary */}
          <div className="card">
            <h3 className="fw-semibold mb-4">Active Orders</h3>
            <div className="flex flex-col gap-3">
              {orders.filter((o) => o.status === 'active').slice(0, 3).map((order) => {
                const pct = Math.round((order.quantityProduced / order.quantityOrdered) * 100);
                return (
                  <div key={order.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm fw-medium">{order.orderNumber}</span>
                      <span className="text-xs text-secondary font-mono">{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-bar__fill ${pct > 80 ? 'progress-bar__fill--success' : pct < 30 ? '' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-secondary">{order.customerName}</span>
                      <span className="text-xs text-secondary">
                        {order.quantityProduced.toLocaleString()} / {order.quantityOrdered.toLocaleString()} m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
