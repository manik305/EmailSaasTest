import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

// Define the shape of our global state
interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

interface Recipient {
  id: number;
  email: string;
  name: string;
  status: string;
  created_at: string;
}

interface Campaign {
  id: number;
  name: string;
  target_segment: string;
  schedule: string;
  status: string;
  created_at: string;
}

interface EmailConfig {
  provider: 'Google Workspace' | 'Microsoft 365' | 'Custom SMTP' | null;
  status: 'Connected' | 'Disconnected';
  accountEmail?: string;
  lastSync?: string;
}

interface AppState {
  metrics: {
    totalEmailsSent: number;
    openRate: number;
    clickRate: number;
    activeCampaigns: number;
    totalFilesUploaded: number;
    dataProcessedCount: number;
  };
  files: UploadedFile[];
  recipients: Recipient[];
  campaigns: Campaign[];
  emailConfig: EmailConfig;
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  addFile: (file: UploadedFile) => void;
  uploadFileToBackend: (file: File) => Promise<void>;
  createCampaign: (data: { name: string; target_segment: string; schedule: string }) => Promise<void>;
  updateEmailConfig: (config: EmailConfig) => void;
  refreshData: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

const initialState: AppState = {
  metrics: {
    totalEmailsSent: 0,
    openRate: 0,
    clickRate: 0,
    activeCampaigns: 0,
    totalFilesUploaded: 0,
    dataProcessedCount: 0,
  },
  files: [],
  recipients: [],
  campaigns: [],
  emailConfig: {
    provider: null,
    status: 'Disconnected',
  },
  isLoading: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const [metricsRes, recipientsRes, campaignsRes, configsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/campaigns/metrics`),
        fetch(`${API_BASE_URL}/data/recipients`),
        fetch(`${API_BASE_URL}/campaigns/`),
        fetch(`${API_BASE_URL}/config/`)
      ]);

      const metrics = await metricsRes.json();
      const recipients = await recipientsRes.json();
      const campaigns = await campaignsRes.json();
      const configs = await configsRes.json();

      const activeConfig = configs.find((c: any) => c.is_active);

      setState(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          ...metrics,
          activeCampaigns: campaigns.filter((c: any) => c.status === 'active').length
        },
        recipients,
        campaigns,
        emailConfig: activeConfig ? {
          provider: activeConfig.provider,
          status: 'Connected',
          accountEmail: activeConfig.sender_address,
          lastSync: new Date(activeConfig.created_at).toLocaleTimeString()
        } : prev.emailConfig,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to fetch app data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addFile = (file: UploadedFile) => {
    setState((prevState) => ({
      ...prevState,
      files: [file, ...prevState.files],
    }));
  };

  const uploadFileToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/data/upload`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const createCampaign = async (data: { name: string; target_segment: string; schedule: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error('Campaign creation failed:', error);
    }
  };

  const updateEmailConfig = async (config: EmailConfig) => {
    try {
      if (config.provider && config.accountEmail) {
        await fetch(`${API_BASE_URL}/config/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: config.provider,
            sender_address: config.accountEmail,
            settings_json: {},
            is_active: true
          }),
        });
      }
      // Refresh local state
      await refreshData();
    } catch (error) {
      console.error('Failed to update email config:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, addFile, uploadFileToBackend, createCampaign, updateEmailConfig, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
