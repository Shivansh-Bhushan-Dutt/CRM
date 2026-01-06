import { LayoutDashboard, FileText, Building2, Users, MessageSquare, Settings, Mail, Briefcase } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tour-files', icon: FileText, label: 'Tour Files' },
    { id: 'emails', icon: Mail, label: 'Emails & Conversations' },
    { id: 'bookings', icon: Briefcase, label: 'Bookings' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-blue-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold">Tour CRM</h1>
        <p className="text-purple-200 text-sm mt-1">Operations Management</p>
      </div>
      
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-purple-200 text-center">
          © 2025 Tour Operations CRM
        </p>
      </div>
    </aside>
  );
}
