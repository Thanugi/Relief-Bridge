import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types
export type Severity = 'Critical' | 'Very High' | 'High' | 'Moderate' | 'Low';

export interface Report {
  id: string;
  type: 'self' | 'relative';
  name: string;
  location: string;
  severity: Severity;
  needs: string[];
  contact: string;
  status: 'Pending' | 'Verified' | 'Resolved';
  timestamp: string;
  description: string;
  evidence?: string;
  lat?: number; // Mock coords
  lng?: number; // Mock coords
}

export interface Volunteer {
  id: string;
  name: string;
  type: 'individual' | 'entity';
  skills: string[];
  contact: string;
  location: string;
}

export interface LongTermSupport {
  id: string;
  type: 'offer' | 'request';
  category: 'Housing' | 'Medical' | 'Education' | 'Livelihood' | 'Other';
  name: string;
  description: string;
  contact: string;
  location: string;
  status: 'Open' | 'Matched';
}

interface AppContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  deleteReport: (id: string) => void;
  
  volunteers: Volunteer[];
  addVolunteer: (volunteer: Omit<Volunteer, 'id'>) => void;
  deleteVolunteer: (id: string) => void;

  longTermSupports: LongTermSupport[];
  addLongTermSupport: (support: Omit<LongTermSupport, 'id' | 'status'>) => void;
  deleteLongTermSupport: (id: string) => void;

  isOffline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial state is empty as requested for the "new" look on launch
const MOCK_REPORTS: Report[] = [];
const MOCK_VOLUNTEERS: Volunteer[] = [];
const MOCK_LTS: LongTermSupport[] = [];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(MOCK_VOLUNTEERS);
  const [longTermSupports, setLongTermSupports] = useState<LongTermSupport[]>(MOCK_LTS);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Back Online",
        description: "Your connection has been restored. Offline reports synced.",
        variant: "default",
      });
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You are Offline",
        description: "Don't worry, you can still save reports locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const addReport = (reportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      status: 'Pending',
      lat: reportData.lat || (6.0 + Math.random()),
      lng: reportData.lng || (80.0 + Math.random())
    };
    
    setReports(prev => [newReport, ...prev]);
    
    toast({
      title: "Report Submitted",
      description: isOffline ? "Saved to offline storage. Will sync when online." : "Your report has been broadcasted to relief teams.",
    });
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Report Deleted",
      description: "The report has been removed from the system.",
    });
  };

  const addVolunteer = (volunteerData: Omit<Volunteer, 'id'>) => {
    const newVolunteer: Volunteer = {
      ...volunteerData,
      id: Math.random().toString(36).substring(7)
    };
    setVolunteers(prev => [...prev, newVolunteer]);
    toast({
      title: "Registered Successfully",
      description: "Thank you for joining the relief effort.",
    });
  };

  const deleteVolunteer = (id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Volunteer entry removed.",
    });
  };

  const addLongTermSupport = (support: Omit<LongTermSupport, 'id' | 'status'>) => {
    const newSupport: LongTermSupport = {
      ...support,
      id: Math.random().toString(36).substring(7),
      status: 'Open'
    };
    setLongTermSupports(prev => [newSupport, ...prev]);
    toast({
      title: "Support Entry Added",
      description: "Your entry has been added to the public pool.",
    });
  }

  const deleteLongTermSupport = (id: string) => {
    setLongTermSupports(prev => prev.filter(l => l.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Support entry removed.",
    });
  };

  return (
    <AppContext.Provider value={{ 
      reports, addReport, deleteReport,
      volunteers, addVolunteer, deleteVolunteer,
      longTermSupports, addLongTermSupport, deleteLongTermSupport,
      isOffline 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
