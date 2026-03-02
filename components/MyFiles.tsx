import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { FileData, Folder } from '../types';
import { Folder as FolderIcon, FileText, Download, Trash2, Plus, HardDrive, AlertTriangle, RefreshCw, Copy, AlertCircle, Database } from 'lucide-react';
import { Modal } from './Modal';

const DEFAULT_MAX_FILES = 10;
const PRO_MAX_FILES = 10000;
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
  const isPro = user.email === 'imahinasyon321@gmail.com';
  const currentMaxFiles = isPro ? PRO_MAX_FILES : DEFAULT_MAX_FILES;

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

  const isOfflineDemo = user.id === 'offline-demo';

  // Fetch files and folders
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    if (isOfflineDemo) {
      setFiles([
        { id: '1', user_id: 'offline-demo', name: 'Demo_Report.pdf', size: 2400000, type: 'application/pdf', download_url: '#', storage_path: '', created_at: new Date().toISOString() },
        { id: '2', user_id: 'offline-demo', name: 'Project_Assets.zip', size: 15600000, type: 'application/zip', download_url: '#', storage_path: '', created_at: new Date().toISOString() }
      ]);
      setFolders([
        { id: 'f1', user_id: 'offline-demo', name: 'Work Projects', created_at: new Date().toISOString() },
        { id: 'f2', user_id: 'offline-demo', name: 'Personal', created_at: new Date().toISOString() }
      ]);
      setLoading(false);
      return;
    }

    try {
      const [filesResult, foldersResult] = await Promise.all([
        supabase.from('files').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('folders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      if (filesResult.error) throw filesResult.error;
      if (foldersResult.error) throw foldersResult.error;

      setFiles(filesResult.data || []);
      setFolders(foldersResult.data || []);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, retryTrigger, isOfflineDemo]);

  const [isTestingConnection, setIsTestingConnection] = useState(false);

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
      const newFolder: Folder = { id: Math.random().toString(), user_id: 'offline-demo', name: newFolderName, created_at: new Date().toISOString() };
      setFolders(prev => [newFolder, ...prev]);
      setNewFolderName('');
      setFolderModalOpen(false);
      return;
    }

    try {
      const { error } = await supabase.from('folders').insert({
        user_id: user.id,
        name: newFolderName
      });
      if (error) throw error;
      setNewFolderName('');
      setFolderModalOpen(false);
      fetchData(); // Refresh
    } catch (error: any) {
      console.error("Error creating folder:", error);
      alert("Error creating folder: " + error.message);
    }
  };

  const checkLimitAndOpenUpload = () => {
    if (files.length >= currentMaxFiles) {
      setUpgradeModalOpen(true);
    } else {
      setUploadModalOpen(true);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

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
      setTimeout(() => {
        cleanup();
        const newFile: FileData = {
          id: Math.random().toString(),
          user_id: 'offline-demo',
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          download_url: '#',
          storage_path: '',
          created_at: new Date().toISOString()
        };
        setFiles(prev => [newFile, ...prev]);
        setUploadModalOpen(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 1500);
      return;
    }

    try {
      if (!user?.id) throw new Error("User not authenticated.");

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('bucket not found')) {
          throw new Error(`Bucket "${BUCKET_NAME}" not found. Please create it in Supabase Storage.`);
        }
        if (uploadError.message.toLowerCase().includes('policy') || (uploadError as any).status === 403 || (uploadError as any).status === 401) {
          throw new Error("Access Denied: Check your Supabase Storage Policies (RLS). You need an 'INSERT' policy for the '" + BUCKET_NAME + "' bucket.");
        }
        throw uploadError;
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // 3. Save Metadata to Supabase DB
      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        storage_path: filePath,
        download_url: publicUrl,
        provider: 'supabase'
      });

      if (dbError) throw dbError;

      cleanup();
      setUploadProgress(100);

      setTimeout(() => {
        setUploadModalOpen(false);
        setSelectedFile(null);
        setUploadProgress(0);
        fetchData(); // Refresh
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
      if (file.storage_path) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([file.storage_path]);

        if (deleteError) {
          console.warn("Supabase storage delete warning:", deleteError);
        }
      }

      // Delete from Supabase DB
      const { error: dbError } = await supabase.from('files').delete().eq('id', file.id);
      if (dbError) throw dbError;

      fetchData(); // Refresh
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
            <p className="text-gray-600 mb-4">{error}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setRetryTrigger(c => c + 1)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <RefreshCw size={16} />
                Retry Connection
              </button>
              <span className="text-xs text-gray-400 flex items-center">
                User ID: {user?.id || 'Not signed in'}
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
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2 transition-colors ${files.length >= currentMaxFiles ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Plus size={16} />
            Add File
          </button>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Storage Limit ({isPro ? 'Pro Plan' : 'Free Plan'})</span>
          <span className={`${files.length >= currentMaxFiles ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
            {files.length} / {currentMaxFiles} files
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${files.length >= currentMaxFiles ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min((files.length / currentMaxFiles) * 100, 100)}%` }}
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
            <p className="text-gray-500 mt-1 max-w-sm">Upload documents to safeguard them in your vault. {isPro ? 'You have unlimited storage.' : `Free plan is limited to ${DEFAULT_MAX_FILES} files.`}</p>
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
                          href={file.download_url}
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
            You have reached the {currentMaxFiles}-file limit on the Free Plan. Upgrade to Pro to unlock unlimited storage and team features.
          </p>
          <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
            Upgrade to Pro - $9/mo
          </button>
        </div>
      </Modal>

    </div>
  );
};