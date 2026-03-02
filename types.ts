export interface Folder {
  id: string;
  name: string;
  createdAt: any;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  downloadURL: string;
  storagePath: string;
  folderId?: string;
  createdAt: any;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  createdAt: any;
}

export enum ViewState {
  OVERVIEW = 'OVERVIEW',
  FILES = 'FILES',
  NOTES = 'NOTES',
  TEAM = 'TEAM'
}