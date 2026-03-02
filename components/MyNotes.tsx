import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Note } from '../types';
import { Plus, StickyNote, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Modal } from './Modal';
import { User } from 'firebase/auth';

interface MyNotesProps {
    user: User;
}

export const MyNotes: React.FC<MyNotesProps> = ({ user }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const isOfflineDemo = user.uid === 'offline-demo';

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isOfflineDemo) {
        setNotes([
            { id: '1', title: 'Project Ideas', content: '1. New AI feature\n2. Mobile app redesign\n3. Marketing campaign Q4', createdAt: new Date() },
            { id: '2', title: 'Meeting Notes', content: 'Discussed timeline for launch. Everyone agreed on the 15th.', createdAt: new Date() }
        ]);
        setLoading(false);
        return;
    }

    const q = query(collection(db, `users/${user.uid}/notes`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(err);
      setError("Failed to load notes. " + err.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, retryTrigger, isOfflineDemo]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    
    if (isOfflineDemo) {
        const newNote = {
            id: Math.random().toString(),
            title,
            content,
            createdAt: new Date()
        };
        setNotes(prev => [newNote, ...prev]);
        setTitle('');
        setContent('');
        setIsModalOpen(false);
        setSaving(false);
        return;
    }

    try {
      await addDoc(collection(db, `users/${user.uid}/notes`), {
        title,
        content,
        createdAt: serverTimestamp()
      });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isOfflineDemo) {
        setNotes(prev => prev.filter(n => n.id !== id));
        return;
    }
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/notes`, id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete note");
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
          <h2 className="text-2xl font-bold text-gray-800">My Notes</h2>
          <p className="text-sm text-gray-500 mt-1">Capture ideas and important details.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="inline-block p-3 bg-yellow-50 rounded-full mb-3">
            <StickyNote className="text-yellow-500" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No notes yet</h3>
          <p className="text-gray-500 mt-1">Create your first note to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-64">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{note.title}</h3>
                <button 
                  onClick={() => handleDelete(note.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto mb-4">
                <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
              </div>
              <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">
                Created recently
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Note"
        footer={
          <>
             <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
             <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Note</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Meeting notes..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none"
              placeholder="Write your thoughts here..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};