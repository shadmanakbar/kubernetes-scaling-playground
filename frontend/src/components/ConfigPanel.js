import React, { useState } from 'react';
import './ConfigPanel.css';

const ConfigPanel = ({ config, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    podResources: {
      requests: {
        cpu: config?.podResources?.requests?.cpu || "1000m",
        memory: config?.podResources?.requests?.memory || "4Gi"
      },
      limits: {
        cpu: config?.podResources?.limits?.cpu || "4000m",
        memory: config?.podResources?.limits?.memory || "5Gi"
      }
    },
    minReplicas: config?.minReplicas || 1,
    maxReplicas: config?.maxReplicas || 10,
    cpuThreshold: config?.cpuThreshold || 60,
    memoryThreshold: config?.memoryThreshold || 60,
    userResources: {
      cpu: config?.userResources?.cpu || 0.5,
      memory: config?.userResources?.memory || 1.0
    },
    defaultLoadProfile: {
      pattern: config?.defaultLoadProfile?.pattern || "random",
      maxUsers: config?.defaultLoadProfile?.maxUsers || 1000,
      baseLoad: config?.defaultLoadProfile?.baseLoad || 100,
      amplitude: config?.defaultLoadProfile?.amplitude || 200,
      period: config?.defaultLoadProfile?.period || 10,
      userGrowthRate: config?.defaultLoadProfile?.userGrowthRate || 200
    }
  });

  const patterns = [
    { value: 'linear', label: 'Linear (Steady increase)' },
    { value: 'sine', label: 'Sinusoidal (Smooth waves)' },
    { value: 'spike', label: 'Spike (Sudden bursts)' },
    { value: 'sawtooth', label: 'Sawtooth (Gradual increase, sharp drop)' },
    { value: 'square', label: 'Square (On/Off pattern)' },
    { value: 'random', label: 'Random (Unpredictable)' },
    { value: 'daily', label: 'Daily (Business hours)' }
  ];

  const handleChange = (path, value) => {
    const newFormData = { ...formData };
    const parts = path.split('.');
    let current = newFormData;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    
    setFormData(newFormData);
  };

  if (!config) {
    return (
      <div className="config-panel">
        <div className="config-content">
          <h2>Loading Configuration...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="config-panel">
      <div className="config-content">
        <h2>Configuration Settings</h2>
        
        <div className="config-section">
          <h3>Pod Resources</h3>
          <div className="config-group">
            <label>CPU Request:</label>
            <input
              type="text"
              value={formData.podResources.requests.cpu}
              onChange={(e) => handleChange('podResources.requests.cpu', e.target.value)}
              placeholder="e.g., 1000m"
            />
          </div>
          <div className="config-group">
            <label>CPU Limit:</label>
            <input
              type="text"
              value={formData.podResources.limits.cpu}
              onChange={(e) => handleChange('podResources.limits.cpu', e.target.value)}
              placeholder="e.g., 4000m"
            />
          </div>
          <div className="config-group">
            <label>Memory Request:</label>
            <input
              type="text"
              value={formData.podResources.requests.memory}
              onChange={(e) => handleChange('podResources.requests.memory', e.target.value)}
              placeholder="e.g., 4Gi"
            />
          </div>
          <div className="config-group">
            <label>Memory Limit:</label>
            <input
              type="text"
              value={formData.podResources.limits.memory}
              onChange={(e) => handleChange('podResources.limits.memory', e.target.value)}
              placeholder="e.g., 5Gi"
            />
          </div>
        </div>

        <div className="config-section">
          <h3>User Resource Usage</h3>
          <div className="config-group">
            <label>CPU per User (%):</label>
            <input
              type="number"
              value={formData.userResources.cpu}
              onChange={(e) => handleChange('userResources.cpu', parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>
          <div className="config-group">
            <label>Memory per User (%):</label>
            <input
              type="number"
              value={formData.userResources.memory}
              onChange={(e) => handleChange('userResources.memory', parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>
        </div>

        <div className="config-section">
          <h3>HPA Settings</h3>
          <div className="config-group">
            <label>Min Replicas:</label>
            <input
              type="number"
              value={formData.minReplicas}
              onChange={(e) => handleChange('minReplicas', parseInt(e.target.value))}
              min="1"
            />
          </div>
          <div className="config-group">
            <label>Max Replicas:</label>
            <input
              type="number"
              value={formData.maxReplicas}
              onChange={(e) => handleChange('maxReplicas', parseInt(e.target.value))}
              min={formData.minReplicas}
            />
          </div>
          <div className="config-group">
            <label>CPU Threshold (%):</label>
            <input
              type="number"
              value={formData.cpuThreshold}
              onChange={(e) => handleChange('cpuThreshold', parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>
          <div className="config-group">
            <label>Memory Threshold (%):</label>
            <input
              type="number"
              value={formData.memoryThreshold}
              onChange={(e) => handleChange('memoryThreshold', parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="config-section">
          <h3>Load Pattern Settings</h3>
          <div className="config-group">
            <label>Pattern Type:</label>
            <select
              value={formData.defaultLoadProfile.pattern}
              onChange={(e) => handleChange('defaultLoadProfile.pattern', e.target.value)}
            >
              {patterns.map(pattern => (
                <option key={pattern.value} value={pattern.value}>
                  {pattern.label}
                </option>
              ))}
            </select>
          </div>
          <div className="config-group">
            <label>Max Users:</label>
            <input
              type="number"
              value={formData.defaultLoadProfile.maxUsers}
              onChange={(e) => handleChange('defaultLoadProfile.maxUsers', parseInt(e.target.value))}
              min="1"
            />
          </div>
          <div className="config-group">
            <label>Base Load:</label>
            <input
              type="number"
              value={formData.defaultLoadProfile.baseLoad}
              onChange={(e) => handleChange('defaultLoadProfile.baseLoad', parseInt(e.target.value))}
              min="1"
            />
          </div>
          <div className="config-group">
            <label>Load Amplitude:</label>
            <input
              type="number"
              value={formData.defaultLoadProfile.amplitude}
              onChange={(e) => handleChange('defaultLoadProfile.amplitude', parseInt(e.target.value))}
              min="1"
            />
          </div>
          <div className="config-group">
            <label>Growth Rate:</label>
            <input
              type="number"
              value={formData.defaultLoadProfile.userGrowthRate}
              onChange={(e) => handleChange('defaultLoadProfile.userGrowthRate', parseInt(e.target.value))}
              min="1"
            />
          </div>
        </div>

        <div className="config-actions">
          <button className="save" onClick={() => onSave(formData)}>Save Changes</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel; 