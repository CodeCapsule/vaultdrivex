import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { supabase } from '../supabase';
import { FileData, Folder } from '../types';
import { Folder as FolderIcon, FileText, Download, Trash2, Plus, HardDrive, AlertTriangle, RefreshCw, Copy, AlertCircle, Database } from 'lucide-react';
import { Modal } from './Modal';
import { User } from 'firebase/auth';

const MAX_FILES = 10; // Increased limit for Supabase demo
const BUCKET_NAME = 'vaultdrive';

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

interface MyFilesProps {
    user: User;
}

export const MyFiles: React.FC<MyFilesProps> = ({ user }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0); 
  
  // Modals
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Form States
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isOfflineDemo = user.uid === 'offline-demo';

  useEffect(() => {
    setLoading(true);
    setError(null);

    // OFFLINE MODE
    if (isOfflineDemo) {
        setFiles([
            { id: '1', name: 'Demo_Report.pdf', size: 2400000, type: 'application/pdf', downloadURL: '#', storagePath: '', createdAt: new Date() },
            { id: '2', name: 'Project_Assets.zip', size: 15600000, type: 'application/zip', downloadURL: '#', storagePath: '', createdAt: new Date() }
        ]);
        setFolders([
            { id: 'f1', name: 'Work Projects', createdAt: new Date() },
            { id: 'f2', name: 'Personal', createdAt: new Date() }
        ]);
        setLoading(false);
        return;
    }

    // FIREBASE MODE
    const filesRef = collection(db, `users/${user.uid}/files`);
    const foldersRef = collection(db, `users/${user.uid}/folders`);

    const qFiles = query(filesRef, orderBy('createdAt', 'desc'));
    const qFolders = query(foldersRef, orderBy('createdAt', 'desc'));

    const unsubFiles = onSnapshot(qFiles, (snapshot) => {
      setFiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FileData)));
      setLoading(false);
      setError(null); 
    }, (err) => {
      console.error("Files Listener Error:", err);
      if (err.code === 'permission-denied') {
        setError("Missing or insufficient permissions.");
      } else {
        setError(err.message);
      }
      setLoading(false);
    });

    const unsubFolders = onSnapshot(qFolders, (snapshot) => {
      setFolders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Folder)));
    }, (err) => {
      console.error("Folders Listener Error:", err);
    });

    return () => {
      unsubFiles();
      unsubFolders();
    };
  }, [user, retryTrigger, isOfflineDemo]);

  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url || url.includes('placeholder')) {
      setErrorMsg("Supabase configuration missing. Please ensure VITE_SUPABASE_URL is set in your environment.");
    }
  }, []);

  const testSupabaseConnection = async () => {
    setIsTestingConnection(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', { limit: 1 });
      if (error) throw error;
      alert(`Successfully connected to Supabase bucket "${BUCKET_NAME}"!`);
    } catch (err: any) {
      console.error("Supabase Connection Test Error:", err);
      alert(`Connection failed: ${err.message || 'Unknown error'}. Make sure the bucket "${BUCKET_NAME}" exists and is public.`);
    } finally {
      setIsTestingConnection(false);
    }
  };
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    if (isOfflineDemo) {
        const newFolder = { id: Math.random().toString(), name: newFolderName, createdAt: new Date() };
        setFolders(prev => [newFolder, ...prev]);
        setNewFolderName('');
        setFolderModalOpen(false);
        return;
    }

    try {
      await addDoc(collection(db, `users/${user.uid}/folders`), {
        name: newFolderName,
        createdAt: serverTimestamp()
      });
      setNewFolderName('');
      setFolderModalOpen(false);
    } catch (error: any) {
      console.error("Error creating folder:", error);
      alert("Error creating folder: " + error.message);
    }
  };

  const checkLimitAndOpenUpload = () => {
    if (files.length >= MAX_FILES) {
      setUpgradeModalOpen(true);
    } else {
      setUploadModalOpen(true);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    
    // Reset state
    setErrorMsg('');
    setUploadProgress(0);
    setIsUploading(true);

    let progressInterval: any = null;
    let timeoutId: any = null;

    const cleanup = () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId) clearTimeout(timeoutId);
      setIsUploading(false);
    };

    // Start progress simulation
    timeoutId = setTimeout(() => {
      setUploadProgress(10);
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return 90;
          return prev + 1;
        });
      }, 200);
    }, 100);

    if (isOfflineDemo) {
        // Simulate upload
        setTimeout(() => {
            cleanup();
            const newFile: FileData = {
                id: Math.random().toString(),
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
                downloadURL: '#',
                storagePath: '',
                createdAt: new Date()
            };
            setFiles(prev => [newFile, ...prev]);
            setUploadModalOpen(false);
            setSelectedFile(null);
            setUploadProgress(0);
        }, 1500);
        return;
    }

    try {
      if (!user?.uid) throw new Error("User not authenticated.");
      
      console.log("Starting upload process for:", selectedFile.name);
      console.log("File size:", selectedFile.size, "Type:", selectedFile.type);
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.uid}/${fileName}`;

      console.log("Uploading to Supabase bucket:", BUCKET_NAME);
      console.log("Target Path:", filePath);
      
      // 1. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        
        if (uploadError.message.includes('bucket not found')) {
          throw new Error(`Bucket "${BUCKET_NAME}" not found. Please create it in Supabase Storage.`);
        }
        
        if (uploadError.message.toLowerCase().includes('policy') || (uploadError as any).status === 403 || (uploadError as any).status === 401) {
          throw new Error("Access Denied: Check your Supabase Storage Policies (RLS). You need an 'INSERT' policy for the '" + BUCKET_NAME + "' bucket.");
        }
        
        throw uploadError;
      }

      console.log("Upload successful, getting public URL...");
      
      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      console.log("Saving metadata to Firestore...");

      // 3. Save Metadata to Firestore
      await addDoc(collection(db, `users/${user.uid}/files`), {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        storagePath: filePath,
        downloadURL: publicUrl,
        createdAt: serverTimestamp(),
        provider: 'supabase'
      });

      cleanup();
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadModalOpen(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 500);

    } catch (err: any) {
      cleanup();
      console.error("Final Upload Error:", err);
      
      let finalMsg = err.message || "Upload failed.";
      if (finalMsg.includes("Failed to fetch")) {
        finalMsg = "Connection failed. Please check your Supabase URL and ensure your internet is working.";
      }
      
      setErrorMsg(finalMsg);
    }
  };

  const handleDeleteFile = async (file: FileData) => {
    if (isOfflineDemo) {
        setFiles(prev => prev.filter(f => f.id !== file.id));
        return;
    }

    try {
      // Delete from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([file.storagePath]);

      if (deleteError) {
        console.warn("Supabase storage delete warning:", deleteError);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, `users/${user.uid}/files`, file.id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete file. Check console for details.");
    }
  };

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl border border-red-100 shadow-sm max-w-2xl mx-auto mt-8">
        <div className="flex items-start gap-4">
          <div className="bg-red-50 p-3 rounded-full shrink-0">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4">
              {error === "Missing or insufficient permissions." 
                ? "We couldn't load your files. This is usually because the **Firestore Security Rules** have not been set up yet."
                : `Error: ${error}`}
            </p>
            
            {error === "Missing or insufficient permissions." && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">How to fix:</p>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Go to Firebase Console &rarr; Firestore Database &rarr; Rules</li>
                  <li>Delete the existing rules.</li>
                  <li>Paste the code below:</li>
                </ol>
                <div className="mt-3 relative group">
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto font-mono">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{allSubcollections=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}`}
                  </pre>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /users/{userId} {\n      allow read, write: if request.auth != null && request.auth.uid == userId;\n      match /{allSubcollections=**} {\n        allow read, write: if request.auth != null && request.auth.uid == userId;\n      }\n    }\n  }\n}`)}
                    className="absolute top-2 right-2 p-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setRetryTrigger(c => c + 1)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <RefreshCw size={16} />
                Retry Connection
              </button>
              <span className="text-xs text-gray-400 flex items-center">
                User ID: {user?.uid || 'Not signed in'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Files</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your documents and assets.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={testSupabaseConnection}
            disabled={isTestingConnection}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            {isTestingConnection ? <RefreshCw size={16} className="animate-spin" /> : <Database size={16} />}
            Test Connection
          </button>
          <button 
            onClick={() => setFolderModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <FolderIcon size={16} />
            New Folder
          </button>
          <button 
            onClick={checkLimitAndOpenUpload}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 transition-colors ${files.length >= MAX_FILES ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Plus size={16} />
            Add File
          </button>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Storage Limit (Free Plan)</span>
          <span className={`${files.length >= MAX_FILES ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
            {files.length} / {MAX_FILES} files
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${files.length >= MAX_FILES ? 'bg-red-500' : 'bg-blue-500'}`} 
            style={{ width: `${Math.min((files.length / MAX_FILES) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Folders Row */}
      {folders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map(folder => (
            <div key={folder.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-all shadow-sm flex flex-col items-center text-center gap-2">
              <FolderIcon className="text-blue-400" size={32} />
              <span className="text-sm font-medium text-gray-700 truncate w-full">{folder.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Files List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <HardDrive className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No files yet</h3>
            <p className="text-gray-500 mt-1 max-w-sm">Upload documents to safeguard them in your vault. Free plan is limited to 5 files.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files.map(file => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      {file.name}
                    </td>
                    <td className="px-6 py-4">{formatBytes(file.size)}</td>
                    <td className="px-6 py-4 truncate max-w-xs text-gray-500">{file.type || 'Unknown'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a 
                          href={file.downloadURL} 
                          target="_blank" 
                          rel="noreferrer"
                          className={`text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors ${isOfflineDemo ? 'pointer-events-none opacity-50' : ''}`}
                          title={isOfflineDemo ? "Not available in offline demo" : "Download"}
                        >
                          <Download size={18} />
                        </a>
                        <button 
                          onClick={() => handleDeleteFile(file)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* New Folder Modal */}
      <Modal 
        isOpen={isFolderModalOpen} 
        onClose={() => setFolderModalOpen(false)} 
        title="Create New Folder"
        footer={
          <>
            <button onClick={() => setFolderModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={handleCreateFolder} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Create Folder</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Finances"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => !isUploading && setUploadModalOpen(false)} 
        title="Upload File"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
              disabled={isUploading}
            />
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <FileText className="text-blue-500 mb-2" size={32} />
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatBytes(selectedFile.size)}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <HardDrive className="text-gray-400 mb-2" size={32} />
                <p className="font-medium text-gray-700">Click to select a file</p>
                <p className="text-xs text-gray-500 mt-1">Any file up to 50MB</p>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg break-words">
              {errorMsg}
              {errorMsg.includes('found') && (
                <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                  <p className="font-semibold mb-1 flex items-center gap-1"><Database size={12} /> Supabase Action Required:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to your Supabase Dashboard</li>
                    <li>Navigate to <strong>Storage</strong></li>
                    <li>Create a new bucket named <strong>"{BUCKET_NAME}"</strong></li>
                    <li>Set the bucket to <strong>Public</strong></li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
             <button 
               onClick={() => setUploadModalOpen(false)} 
               disabled={isUploading}
               className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
             >
               Cancel
             </button>
             <button 
               onClick={handleUploadFile} 
               disabled={!selectedFile || isUploading}
               className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isUploading ? 'Uploading...' : 'Upload File'}
             </button>
          </div>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setUpgradeModalOpen(false)} 
        title="Upgrade Plan"
        footer={
          <button onClick={() => setUpgradeModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>
        }
      >
        <div className="text-center py-4">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-blue-600" size={32} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Limit Reached</h4>
          <p className="text-gray-600 mb-6">
            You have reached the 5-file limit on the Free Plan. Upgrade to Pro to unlock unlimited storage and team features.
          </p>
          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
            Upgrade to Pro - $9/mo
          </button>
        </div>
      </Modal>

    </div>
  );
};