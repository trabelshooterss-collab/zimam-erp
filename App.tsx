
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ProjectRoadmap from './components/ProjectRoadmap';
import WhatsAppOCR from './components/WhatsAppOCR';
import Invoices from './components/Invoices';
import POS from './components/POS';
import Settings from './components/Settings';
import Purchases from './components/Purchases';
import People from './components/People';
import Accounting from './components/Accounting';
import AiAssistant from './components/AiAssistant';
import Auth from './components/Auth';
import VoiceCommander from './components/VoiceCommander';
import { LanguageProvider, useLanguage } from './i18n';
import { StoreProvider } from './context/StoreContext';
import { User } from './types';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const { dir } = useLanguage();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'ai_assistant': return <AiAssistant />;
      case 'inventory': return <Inventory />;
      case 'pos': return <POS />;
      case 'purchases': return <Purchases />;
      case 'customers': return <People type="customer" />;
      case 'suppliers': return <People type="supplier" />;
      case 'accounting': return <Accounting />;
      case 'whatsapp': return <WhatsAppOCR />;
      case 'roadmap': return <ProjectRoadmap />;
      case 'invoices': return <Invoices />;
      case 'settings': return <Settings />;
      default: return <div className="p-10">Module Under Development</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={dir}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isOpen={sidebarOpen} activeTab={activeTab} onTabChange={setActiveTab} />
        <main className={`flex-1 transition-all duration-300 overflow-y-auto h-[calc(100vh-4rem)] ${sidebarOpen ? 'md:ms-64' : 'md:ms-20'}`}>
          {renderContent()}
        </main>
      </div>
      {/* Global Voice Commander with capability to switch tabs */}
      <VoiceCommander setActiveTab={setActiveTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </LanguageProvider>
  );
};

export default App;
