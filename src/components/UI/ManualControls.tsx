import React, { useState } from 'react';
import { UserPlus, Send, Link } from 'lucide-react';
import { eventPipeline } from '../../store/eventPipeline';
import { useGraphStore } from '../../store/graphStore';

export const ManualControls: React.FC = () => {
  const nodesMap = useGraphStore(state => state.nodes);
  const nodes = React.useMemo(() => Array.from(nodesMap.values()), [nodesMap]);
  const users = nodes.filter(n => n.type === 'USER');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const [connectSourceId, setConnectSourceId] = useState<string>('');
  const [connectTargetId, setConnectTargetId] = useState<string>('');

  const handleAddUser = () => {
    eventPipeline.manualAddUser();
  };

  const handleTriggerPost = () => {
    const targetUserId = selectedUserId || (users.length > 0 ? users[0].id : null);
    if (targetUserId) {
      eventPipeline.manualTriggerPost(targetUserId);
    } else {
      alert("No users available to trigger a post. Add a user first.");
    }
  };

  const handleConnectUsers = () => {
    const source = connectSourceId || (users.length > 0 ? users[0].id : null);
    const target = connectTargetId || (users.length > 1 ? users[1].id : null);
    if (source && target && source !== target) {
      eventPipeline.manualAddFriend(source, target);
    } else {
      alert("Please select two distinct users.");
    }
  };

  return (
    <div className="panel-section">
      <h3 className="panel-title" style={{ color: 'var(--accent-primary)' }}>Manual Overrides</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Add User */}
        <div>
          <button 
            onClick={handleAddUser}
            style={{
              width: '100%', padding: '8px', border: '1px solid var(--border-color)',
              background: 'white', borderRadius: '4px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 500
            }}
          >
            <UserPlus size={14} /> Add New User
          </button>
        </div>

        {/* Connect Users */}
        <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Create Social Edge</label>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <select 
              value={connectSourceId}
              onChange={(e) => setConnectSourceId(e.target.value)}
              className="monospace"
              style={{ width: '50%', padding: '6px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            >
              {users.length === 0 && <option value="">-</option>}
              {users.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <select 
              value={connectTargetId}
              onChange={(e) => setConnectTargetId(e.target.value)}
              className="monospace"
              style={{ width: '50%', padding: '6px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            >
              {users.length === 0 && <option value="">-</option>}
              {users.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
          
          <button 
            onClick={handleConnectUsers}
            disabled={users.length < 2}
            className="primary"
            style={{
              width: '100%', padding: '8px', borderRadius: '4px', cursor: users.length > 1 ? 'pointer' : 'not-allowed',
              opacity: users.length > 1 ? 1 : 0.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 500
            }}
          >
            <Link size={14} /> Connect Users
          </button>
        </div>

        {/* Trigger Post */}
        <div style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Force Post & Fanout</label>
          <select 
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="monospace"
            style={{ width: '100%', padding: '6px', fontSize: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '8px' }}
          >
            {users.length === 0 && <option value="">No Users</option>}
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
          
          <button 
            onClick={handleTriggerPost}
            disabled={users.length === 0}
            className="primary"
            style={{
              width: '100%', padding: '8px', borderRadius: '4px', cursor: users.length ? 'pointer' : 'not-allowed',
              opacity: users.length ? 1 : 0.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 500
            }}
          >
            <Send size={14} /> Trigger Post
          </button>
        </div>

      </div>
    </div>
  );
};
