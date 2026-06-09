import React, { useState } from 'react';
import { Target, Zap, Package, TrendingUp, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function Targets() {
  const { targets, updateTargets } = useAppStore();
  const [localTargets, setLocalTargets] = useState(targets);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateTargets(localTargets);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-content">
      <div className="section-header">
        <div>
          <h2 className="section-title">Plant Targets</h2>
          <p className="section-subtitle">Set global operational goals and baseline standards</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave}>
          {saved ? <Check size={16} /> : <Target size={16} />}
          {saved ? 'Saved!' : 'Save Targets'}
        </button>
      </div>

      <div className="grid-3 gap-6">
        {/* Production Target */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="kpi-card__icon" style={{ background: 'var(--color-blue-500)22', color: 'var(--color-blue-500)' }}>
              <Package size={20} />
            </div>
            <h3 className="fw-semibold">Daily Production</h3>
          </div>
          <p className="text-sm text-secondary mb-6">Target for total meters produced across all running looms in a 24-hour cycle.</p>
          
          <div className="form-group mb-4">
            <label className="form-label">Meters (m)</label>
            <input 
              type="number" 
              className="form-control" 
              value={localTargets.dailyProductionMeters} 
              onChange={e => setLocalTargets({ ...localTargets, dailyProductionMeters: +e.target.value })} 
            />
          </div>
          <div className="font-mono text-sm fw-medium text-accent">
            Current: {targets.dailyProductionMeters.toLocaleString()} m
          </div>
        </div>

        {/* Efficiency Target */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="kpi-card__icon" style={{ background: 'var(--color-emerald-500)22', color: 'var(--color-emerald-500)' }}>
              <Zap size={20} />
            </div>
            <h3 className="fw-semibold">Minimum Efficiency</h3>
          </div>
          <p className="text-sm text-secondary mb-6">The baseline acceptable efficiency percentage across the entire plant floor.</p>
          
          <div className="form-group mb-4">
            <label className="form-label">Efficiency (%)</label>
            <input 
              type="number" 
              className="form-control" 
              value={localTargets.minimumEfficiencyPercent} 
              onChange={e => setLocalTargets({ ...localTargets, minimumEfficiencyPercent: +e.target.value })} 
            />
          </div>
          <div className="font-mono text-sm fw-medium text-success">
            Current: {targets.minimumEfficiencyPercent}%
          </div>
        </div>

        {/* Wastage Target */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="kpi-card__icon" style={{ background: 'var(--color-amber-500)22', color: 'var(--color-amber-500)' }}>
              <TrendingUp size={20} />
            </div>
            <h3 className="fw-semibold">Maximum Wastage</h3>
          </div>
          <p className="text-sm text-secondary mb-6">The maximum allowable deviation/wastage percentage for raw material consumption.</p>
          
          <div className="form-group mb-4">
            <label className="form-label">Wastage Threshold (%)</label>
            <input 
              type="number" 
              className="form-control" 
              value={localTargets.maxWastagePercent} 
              onChange={e => setLocalTargets({ ...localTargets, maxWastagePercent: +e.target.value })} 
            />
          </div>
          <div className="font-mono text-sm fw-medium text-warning">
            Current: {targets.maxWastagePercent}%
          </div>
        </div>
      </div>
    </div>
  );
}
