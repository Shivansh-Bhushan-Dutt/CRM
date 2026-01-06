import { User, Lock, Bell, Globe, Mail, Upload } from 'lucide-react';
import { User as UserType } from '../App';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from './ui/button';
import { ExcelImport } from './ExcelImport';

interface SettingsPageProps {
  currentUser: UserType;
}

export function SettingsPage({ currentUser }: SettingsPageProps) {
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleOutlookConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setOutlookConnected(!outlookConnected);
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Import Section - Only for Admin */}
      {currentUser.isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-purple-600" />
              <div>
                <h2 className="font-semibold">Excel/CSV Import</h2>
                <p className="text-sm text-gray-600">Import tour files, hotels, and guides from Excel/CSV files</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowImport(!showImport)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {showImport ? 'Hide Import' : 'Show Import'}
            </Button>
          </div>
          
          {showImport && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-purple-200"
            >
              <ExcelImport />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">Profile Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <p className="font-medium">{currentUser.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <p className="font-medium capitalize">{currentUser.role}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Access Level</label>
              <p className="font-medium">{currentUser.isAdmin ? 'Full Access (Admin)' : 'Limited Access (Manager)'}</p>
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">Security</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Change password, enable two-factor authentication</p>
            <button className="text-sm text-purple-600 hover:underline">Change Password</button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Tour updates</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Marketing emails</span>
            </label>
          </div>
        </motion.div>

        {/* Outlook Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">Outlook Integration</h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Outlook account to sync emails and conversations directly within the CRM. 
              All company communication will be centralized in one place.
            </p>
            
            <div className={`p-4 rounded-lg ${outlookConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {outlookConnected ? '✓ Outlook Connected' : '○ Outlook Not Connected'}
                  </p>
                  {outlookConnected && (
                    <p className="text-sm text-green-600 mt-1">
                      Syncing emails and conversations
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleOutlookConnect}
                  disabled={isConnecting}
                  className={outlookConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  {isConnecting ? 'Connecting...' : (outlookConnected ? 'Disconnect' : 'Connect Outlook')}
                </Button>
              </div>
            </div>

            {outlookConnected && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <h3 className="text-sm font-semibold">Sync Settings</h3>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Sync all emails automatically</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Create conversations from email threads</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Link emails to tour files automatically</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Send CRM notifications to Outlook</span>
                </label>
              </div>
            )}
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Language</label>
              <select className="mt-1 block w-full rounded-md border border-gray-300 p-2">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Timezone</label>
              <select className="mt-1 block w-full rounded-md border border-gray-300 p-2">
                <option>IST (India Standard Time)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
