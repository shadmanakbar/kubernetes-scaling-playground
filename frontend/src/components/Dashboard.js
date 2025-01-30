import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartComponent from './ChartComponent';
import "./Dashboard.css";
import ConfigPanel from './ConfigPanel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PodStatus = ({ pod }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Running':
        return '#155724';
      case 'CrashLoopBackOff':
        return '#721c24';
      default:
        return '#856404';
    }
  };

  const timeToRestart = pod.restartingAt ? new Date(pod.restartingAt) - new Date() : 0;

  return (
    <div className="pod-status">
      <div 
        className="status-badge"
        style={{ 
          background: getStatusColor(pod.status) + '20',
          color: getStatusColor(pod.status)
        }}
      >
        {pod.status}
        {pod.restarts > 0 && ` (Restarts: ${pod.restarts})`}
      </div>
      
      {pod.lastError && (
        <div className="pod-error">
          Error: {pod.lastError}
          {timeToRestart > 0 && ` - Restarting in ${Math.ceil(timeToRestart / 1000)}s`}
        </div>
      )}
      
      <div className="user-types">
        {pod.activeUsers && (
          <>
            <span className="user-type light">Light: {pod.activeUsers.filter(u => u.type === 'light').length}</span>
            <span className="user-type medium">Medium: {pod.activeUsers.filter(u => u.type === 'medium').length}</span>
            <span className="user-type heavy">Heavy: {pod.activeUsers.filter(u => u.type === 'heavy').length}</span>
          </>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [pods, setPods] = useState([]);
  const [metrics, setMetrics] = useState({
    timestamps: [],
    cpu: [],
    memory: [],
    podCount: [],
    userCount: []
  });
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('dark-mode');
  };

  const handleWebSocketMessage = useCallback((event) => {
    const data = JSON.parse(event.data);
    setPods(data.pods);
    
    setMetrics(prev => ({
      timestamps: [...prev.timestamps, new Date(data.timestamp).toLocaleTimeString()],
      cpu: [...prev.cpu, data.averages.cpu],
      memory: [...prev.memory, data.averages.memory],
      podCount: [...prev.podCount, data.pods.length],
      userCount: [...prev.userCount, data.totalUsers]
    }));
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    wsRef.current = new WebSocket('ws://localhost:5000');
    wsRef.current.onmessage = handleWebSocketMessage;

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setError(null);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError("WebSocket error: Connection failed");
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket closed');
      if (isRunning) {
        // Try to reconnect after 2 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 2000);
      }
    };
  }, [handleWebSocketMessage]);

  // Fetch initial configuration
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [configResponse, statusResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/simulation/config"),
          axios.get("http://localhost:5000/api/simulation/status")
        ]);
        setConfig(configResponse.data);
        const isSimulationRunning = statusResponse.data.isRunning;
        setIsRunning(isSimulationRunning);
        
        if (isSimulationRunning) {
          connectWebSocket();
        }
      } catch (err) {
        setError("Failed to fetch initial data: " + err.message);
      }
    };
    fetchInitialData();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const startSimulation = async () => {
    try {
      setMetrics({
        timestamps: [],
        cpu: [],
        memory: [],
        podCount: [],
        userCount: []
      });
      setPods([]);

      await axios.post("http://localhost:5000/api/simulation/start");
      setIsRunning(true);
      setError(null);
      connectWebSocket();
    } catch (err) {
      setError("Failed to start simulation: " + err.message);
      setIsRunning(false);
    }
  };

  const stopSimulation = async () => {
    try {
      await axios.post("http://localhost:5000/api/simulation/stop");
      setIsRunning(false);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    } catch (err) {
      setError("Failed to stop simulation: " + err.message);
    }
  };

  const handleConfigSave = async (newConfig) => {
    try {
      await axios.post("http://localhost:5000/api/simulation/config", newConfig);
      setConfig(newConfig);
      setShowConfig(false);
    } catch (err) {
      setError("Failed to update configuration: " + err.message);
    }
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Kubernetes Auto Scaling Simulator</h1>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowConfig(true)}
            className="config"
            disabled={!config}
          >
            Configure
          </button>
          <button 
            onClick={isRunning ? stopSimulation : startSimulation}
            className={isRunning ? 'stop' : 'start'}
          >
            {isRunning ? 'Stop Simulation' : 'Start Simulation'}
          </button>
        </div>
      </header>

      {showConfig && config && (
        <ConfigPanel
          config={config}
          onSave={handleConfigSave}
          onClose={() => setShowConfig(false)}
        />
      )}

      {error && <div className="error">{error}</div>}

      <div className="metrics-grid">
        {metrics.timestamps.length === 0 ? (
          <div className="no-data-message">
            No simulation data available. Click 'Start Simulation' to begin.
          </div>
        ) : (
          <>
            <div className="chart-container">
              <ChartComponent
                title="Active Users"
                data={metrics.userCount}
                labels={metrics.timestamps}
                color="rgb(153, 102, 255)"
                yAxisMax={config?.defaultLoadProfile?.maxUsers || 1000}
              />
            </div>
            <div className="chart-container">
              <ChartComponent
                title="Pod Count"
                data={metrics.podCount}
                labels={metrics.timestamps}
                color="rgb(54, 162, 235)"
                yAxisMax={config?.maxReplicas || 20}
              />
            </div>
            <div className="chart-container">
              <ChartComponent
                title="CPU Usage"
                data={metrics.cpu}
                labels={metrics.timestamps}
                color="rgb(75, 192, 192)"
              />
            </div>
            <div className="chart-container">
              <ChartComponent
                title="Memory Usage"
                data={metrics.memory}
                labels={metrics.timestamps}
                color="rgb(255, 99, 132)"
              />
            </div>
          </>
        )}
      </div>

      <div className="pods-container">
        <h2>Active Pods</h2>
        <div className="pods-grid">
          {pods.map(pod => (
            <div key={pod.name} className={`pod-card ${pod.status.toLowerCase()}`}>
              <h3>{pod.name}</h3>
              <div className="pod-metrics">
                <div className="metric">
                  <span className="metric-label">Users: {pod.activeUsers?.length || 0}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">CPU:</span>
                  <div className="metric-bar">
                    <div 
                      className={`metric-fill cpu ${pod.metrics?.cpu >= 90 ? 'critical' : ''}`}
                      style={{width: `${pod.metrics?.cpu || 0}%`}}
                    >
                      {pod.metrics?.cpu?.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="metric">
                  <span className="metric-label">Memory:</span>
                  <div className="metric-bar">
                    <div 
                      className={`metric-fill memory ${pod.metrics?.memory >= 90 ? 'critical' : ''}`}
                      style={{width: `${pod.metrics?.memory || 0}%`}}
                    >
                      {pod.metrics?.memory?.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="pod-resources">
                <small>
                  Requests: {pod.resources.requests.cpu} CPU, {pod.resources.requests.memory} Memory
                </small>
                <small>
                  Limits: {pod.resources.limits.cpu} CPU, {pod.resources.limits.memory} Memory
                </small>
              </div>
              <PodStatus pod={pod} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;