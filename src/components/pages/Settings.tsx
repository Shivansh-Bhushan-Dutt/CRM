import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  Settings as SettingsIcon, 
  Bell, 
  Link2,
  Shield,
  Database,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const users = [
  { id: 1, name: 'Raghwendra Kumar', email: 'rk@immerseindiatours.com', role: 'Admin', fileStatus: 'active' },
  { id: 2, name: 'Madhu Chaudhary', email: 'mc@immerseindiatours.com', role: 'Manager', fileStatus: 'active' },
  { id: 3, name: 'Sumesh Sudharasan', email: 'ss@immerseindiatours.com', role: 'Operator', fileStatus: 'active' },
  { id: 4, name: 'Anima Biswal', email: 'ab@immerseindiatours.com', role: 'Operator', fileStatus: 'active' },
];

const integrations = [
  { id: 1, name: 'Microsoft Outlook', fileStatus: 'connected', lastSync: '2 mins ago', icon: '📧' },
  { id: 2, name: 'Google Drive', fileStatus: 'connected', lastSync: '15 mins ago', icon: '📁' },
  { id: 3, name: 'Dropbox', fileStatus: 'disconnected', lastSync: '-', icon: '📦' },
  { id: 4, name: 'WhatsApp Business', fileStatus: 'connected', lastSync: '5 mins ago', icon: '💬' },
];

const parsingRules = [
  { id: 1, type: 'Flight', provider: 'SpiceJet', accuracy: 95, processed: 1234 },
  { id: 2, type: 'Flight', provider: 'IndiGo', accuracy: 92, processed: 2156 },
  { id: 3, type: 'Train', provider: 'IRCTC', accuracy: 88, processed: 876 },
  { id: 4, type: 'Hotel', provider: 'Taj Hotels', accuracy: 90, processed: 543 },
  { id: 5, type: 'Bus', provider: 'RedBus', accuracy: 85, processed: 324 },
];

export function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-gray-600">Manage system configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link2 className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="parsing">
            <Database className="w-4 h-4 mr-2" />
            Parsing Rules
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Users & Roles */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge className={user.fileStatus === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {user.fileStatus}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div></div>
                  <div className="text-center text-sm">Admin</div>
                  <div className="text-center text-sm">Manager</div>
                  <div className="text-center text-sm">Operator</div>
                </div>
                
                {['View Bookings', 'Edit Bookings', 'Delete Bookings', 'Manage Users', 'View Reports', 'System Settings'].map((permission) => (
                  <div key={permission} className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm">{permission}</div>
                    <div className="flex justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-center">
                      {['Manage Users', 'System Settings'].includes(permission) ? (
                        <XCircle className="w-5 h-5 text-red-300" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {['Edit Bookings', 'Delete Bookings', 'Manage Users', 'System Settings'].includes(permission) ? (
                        <XCircle className="w-5 h-5 text-red-300" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{integration.icon}</div>
                          <div>
                            <p>{integration.name}</p>
                            <p className="text-sm text-gray-500">Last sync: {integration.lastSync}</p>
                          </div>
                        </div>
                        <Badge className={integration.fileStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'}>
                          {integration.fileStatus}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {integration.fileStatus === 'connected' ? (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              Configure
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" className="w-full">
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Production API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="password" value="sk_live_************************" readOnly />
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>
              <div>
                <Label>Development API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input type="password" value="sk_test_************************" readOnly />
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parsing Rules */}
        <TabsContent value="parsing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Parsing Rules Monitor</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {parsingRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <Badge variant="outline">{rule.type}</Badge>
                      <div className="flex-1">
                        <p>{rule.provider}</p>
                        <p className="text-sm text-gray-500">{rule.processed.toLocaleString()} documents processed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="text-lg text-green-600">{rule.accuracy}%</p>
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                          style={{ width: `${rule.accuracy}%` }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parsing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>Auto-parse incoming emails</p>
                  <p className="text-sm text-gray-500">Automatically extract ticket information from emails</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>Manual review for low confidence</p>
                  <p className="text-sm text-gray-500">Flag documents with confidence below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>Auto-link to bookings</p>
                  <p className="text-sm text-gray-500">Automatically link parsed tickets to existing bookings</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Label>Confidence Threshold (%)</Label>
                <Input type="number" defaultValue="70" className="mt-2" />
                <p className="text-sm text-gray-500 mt-1">Documents below this confidence will require manual review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>New booking created</p>
                  <p className="text-sm text-gray-500">Receive notification when a new booking is created</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>Parsing failed</p>
                  <p className="text-sm text-gray-500">Alert when document parsing fails</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>Manual review required</p>
                  <p className="text-sm text-gray-500">Notify when a document needs manual review</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p>Daily summary report</p>
                  <p className="text-sm text-gray-500">Receive daily summary of activities</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminder Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <Label>Default reminder time before trip (days)</Label>
                <Input type="number" defaultValue="3" className="mt-2" />
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Label>Follow-up reminder after trip (days)</Label>
                <Input type="number" defaultValue="2" className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
