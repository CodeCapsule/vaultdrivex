import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { TeamMember } from '../types';
import { Plus, Users, User as UserIcon, AlertTriangle, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';
import { User } from 'firebase/auth';

interface TeamMembersProps {
    user: User;
}

export const TeamMembers: React.FC<TeamMembersProps> = ({ user }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [retryTrigger, setRetryTrigger] = useState(0);

  const isOfflineDemo = user.uid === 'offline-demo';

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isOfflineDemo) {
        setMembers([
            { id: '1', name: 'Alice Smith', role: 'Admin', createdAt: new Date() },
            { id: '2', name: 'Bob Johnson', role: 'Editor', createdAt: new Date() }
        ]);
        setLoading(false);
        return;
    }

    const q = query(collection(db, `users/${user.uid}/teamMembers`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember)));
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(err);
      setError("Failed to load team members. " + err.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, retryTrigger, isOfflineDemo]);

  const handleAddMember = async () => {
    if (!name.trim()) return;
    
    if (isOfflineDemo) {
        const newMember = {
            id: Math.random().toString(),
            name,
            role: role || 'Member',
            createdAt: new Date()
        };
        setMembers(prev => [newMember, ...prev]);
        setName('');
        setRole('');
        setIsModalOpen(false);
        return;
    }

    try {
      await addDoc(collection(db, `users/${user.uid}/teamMembers`), {
        name,
        role: role || 'Member',
        createdAt: serverTimestamp()
      });
      setName('');
      setRole('');
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to add member");
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 flex flex-col items-center text-center gap-3">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle className="text-red-600" size={32} />
        </div>
        <h3 className="text-lg font-bold text-red-800">Connection Error</h3>
        <p className="text-red-700 max-w-md mb-2">{error}</p>
        <button 
          onClick={() => setRetryTrigger(c => c + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
          <p className="text-sm text-gray-500 mt-1">Collaborate with your organization.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading team...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="inline-block p-3 bg-blue-50 rounded-full mb-3">
            <Users className="text-blue-500" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No team members</h3>
          <p className="text-gray-500 mt-1">Invite colleagues to collaborate.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <UserIcon size={16} />
                      </div>
                      {member.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Team Member"
        footer={
          <>
             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
             <button onClick={handleAddMember} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Add Member</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};