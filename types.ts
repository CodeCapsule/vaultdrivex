export interface Folder {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface FileData {
  id: string;
  user_id: string;
  name: string;
  size: number;
  type: string;
  download_url: string;
  storage_path: string;
  provider?: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  role: string;
  created_at: string;
}

export enum ViewState {
  OVERVIEW = 'OVERVIEW',
  FILES = 'FILES',
  NOTES = 'NOTES',
  TEAM = 'TEAM'
}