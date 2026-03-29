import React, { useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import axios from 'axios';

const DARK_THEME = {
  bg: '#0d1117',
  text: '#c9d1d9',
  accent: '#58a6ff',
  danger: '#f85149',
  border: '#30363d',
  card: '#161b22'
};

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [path, setPath] = useState('');
  const [blastRadius, setBlastRadius] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Using 127.0.0.1 for stability on Windows systems
  const API_BASE = "http://127.0.0.1:8000";

  const scanRepo = async () => {
    if (!path) {
      alert("Please enter a folder path!");
      return;
    }

    setLoading(true);
    try {
      // Automatically sanitize Windows backslashes to forward slashes
      const sanitizedPath = path.replace(/\\/g, '/');
      const res = await axios.get(`${API_BASE}/scan?path=${encodeURIComponent(sanitizedPath)}`);
      
      if (!res.data.nodes || res.data.nodes.length === 0) {
        alert("No Python (.py) files found in this directory!");
      }
      setData(res.data);
      setBlastRadius(new Set()); 
      setSelectedNode(null);
    } catch (err) {
      console.error(err);
      alert("Network Error: Ensure the backend server is running (python main.py)");
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (node) => {
    setSelectedNode(node);
    try {
      const res = await axios.get(`${API_BASE}/impact?node_id=${encodeURIComponent(node.id)}`);
      setBlastRadius(new Set([...res.data, node.id]));
    } catch (err) {
      console.error("Impact Analysis Error:", err);
    }
  };

  const topRiskFiles = useMemo(() => {
    return [...data.nodes].sort((a, b) => b.risk - a.risk).slice(0, 10);
  }, [data]);

  return (
    <div style={{ backgroundColor: DARK_THEME.bg, color: DARK_THEME.text, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header style={{ padding: '15px 25px', borderBottom: `1px solid ${DARK_THEME.border}`, display: 'flex', gap: '20px', alignItems: 'center', background: DARK_THEME.bg }}>
        <h2 style={{ margin: 0, color: DARK_THEME.accent, whiteSpace: 'nowrap' }}>Legacy Mapper AI</h2>
        <input 
          style={{ flex: 1, padding: '12px', borderRadius: '6px', border: `1px solid ${DARK_THEME.border}`, background: DARK_THEME.card, color: 'white', outline: 'none' }}
          placeholder="Enter folder path (e.g. D:/Projects/MyApp)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        />
        <button 
          onClick={scanRepo} 
          disabled={loading}
          style={{ padding: '12px 25px', backgroundColor: loading ? '#30363d' : DARK_THEME.accent, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR SECTION */}
        <aside style={{ width: '380px', minWidth: '380px', borderRight: `1px solid ${DARK_THEME.border}`, padding: '20px', overflowY: 'auto', background: '#0d1117' }}>
          <h3 style={{ borderBottom: `1px solid ${DARK_THEME.border}`, paddingBottom: '10px' }}>Top Risk Modules</h3>
          
          {topRiskFiles.length === 0 && <p style={{ opacity: 0.5 }}>No data available. Please scan a path.</p>}
          
          {topRiskFiles.map(f => (
            <div key={f.id} style={{ padding: '12px', marginBottom: '10px', background: DARK_THEME.card, borderRadius: '6px', borderLeft: `5px solid ${f.risk > 7 ? DARK_THEME.danger : '#e3b341'}` }}>
              <div style={{ fontSize: '0.85em', fontWeight: 'bold', color: DARK_THEME.accent, wordBreak: 'break-all' }}>{f.id}</div>
              <div style={{ fontSize: '0.9em', marginTop: '5px' }}>Criticality Score: <b>{f.risk.toFixed(2)}/10</b></div>
            </div>
          ))}
          
          {selectedNode && (
            <div style={{ marginTop: '20px', padding: '15px', border: `1px solid ${DARK_THEME.accent}`, borderRadius: '8px', background: 'rgba(88, 166, 255, 0.05)' }}>
              <h4 style={{ color: DARK_THEME.accent, marginTop: 0 }}>Impact Prediction</h4>
              <p style={{ fontSize: '0.95em', lineHeight: '1.4' }}>Modifying <b>{selectedNode.id}</b> potentially impacts <b>{blastRadius.size - 1}</b> other modules in the system.</p>
              <button onClick={() => {setBlastRadius(new Set()); setSelectedNode(null);}} style={{ background: 'transparent', border: `1px solid ${DARK_THEME.border}`, color: DARK_THEME.text, cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>Clear Selection</button>
            </div>
          )}
        </aside>

        {/* GRAPH SECTION */}
        <main style={{ flex: 1, position: 'relative' }}>
          <ForceGraph2D
            graphData={data}
            nodeLabel={node => `File: ${node.id}\nCriticality: ${node.risk.toFixed(2)}`}
            nodeColor={node => blastRadius.has(node.id) ? DARK_THEME.danger : (node.risk > 7 ? '#e3b341' : DARK_THEME.accent)}
            nodeRelSize={7}
            nodeVal={node => node.risk * 1.5}
            linkColor={() => '#444'}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            onNodeClick={handleNodeClick}
            linkDirectionalParticles={node => blastRadius.has(node.source.id) ? 4 : 0}
            linkDirectionalParticleWidth={3}
            backgroundColor="#0d1117"
          />
        </main>
      </div>
    </div>
  );
}

export default App;