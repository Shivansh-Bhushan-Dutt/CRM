import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FileCode, Plus, Search, Download, Upload } from 'lucide-react';

// Placeholder for images - replace with actual images later
const exampleImage1 = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%238b5cf6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dy=".3em"%3EImage 1%3C/text%3E%3C/svg%3E';
const exampleImage2 = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%236366f1" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="white" text-anchor="middle" dy=".3em"%3EImage 2%3C/text%3E%3C/svg%3E';

const cityCodes = [
  { city: 'Delhi', code: 'DL' },
  { city: 'Bhubaneswar', code: 'BB' },
  { city: 'Cochin', code: 'CK' },
];

const fileManagers = [
  { name: 'Anima Biswal', code: 'AB' },
  { name: 'Madhu Chaudhary', code: 'MC' },
  { name: 'Sumesh Sudharasan', code: 'SS' },
  { name: 'Raghwendra Kumar', code: 'RK' },
  { name: 'Pamlesh Rana', code: 'PR' },
  { name: 'Ujjwal', code: 'UK' },
  { name: 'Shambu Rawat', code: 'SR' },
  { name: 'Jitendra Yadav', code: 'JY' },
  { name: 'Abhay Raj Singh', code: 'AS' },
  { name: 'Nidhi Gopal', code: 'NG' },
  { name: 'Ketan Gupta', code: 'KG' },
  { name: 'Sunil Verma', code: 'SV' },
];

const agentCodes = [
  { name: 'Venus Travel', code: 'VT' },
  { name: 'Viva Holidays', code: 'VH' },
  { name: 'Inspiring Vacations', code: 'IV' },
  { name: 'Sanskriti Tours', code: 'ST' },
  { name: 'Soulful Safaris', code: 'SS' },
  { name: 'Direct Client', code: 'DC' },
  { name: 'Referral Client', code: 'RF' },
  { name: '24x7 Rooms.com', code: 'RC' },
  { name: 'Trip Tailor', code: 'TT' },
  { name: 'Muziris Heritage', code: 'MH' },
  { name: 'Explore', code: 'EX' },
  { name: 'Fest Travel', code: 'FT' },
  { name: 'Japan', code: 'JP' },
  { name: 'ROCS', code: 'RO' },
  { name: 'Buckenham Travel', code: 'BT' },
  { name: 'Celebration India Holidays', code: 'CI' },
  { name: 'Hooting Owls', code: 'HO' },
  { name: 'Royal Mountain Tours', code: 'RM' },
  { name: 'Flywell Tours', code: 'FW' },
  { name: 'Destinations World wide', code: 'DW' },
  { name: 'Business Promotion / FAM', code: 'BP' },
];

export function FileCodeManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [formData, setFormData] = useState({
    city: '',
    fileManager: '',
    month: '',
    year: '',
    operator: '',
    sequence: '0001'
  });

  const generateFileCode = () => {
    if (formData.city && formData.fileManager && formData.month && formData.year && formData.operator) {
      const code = `${formData.city}-${formData.fileManager}-${formData.month}-${formData.year}-${formData.operator}-${formData.sequence}`;
      setGeneratedCode(code);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">File Code Manager</h1>
          <p className="text-gray-600">Manage file codes and reference data for tour operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Code Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Generate File Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City Code</Label>
                <select 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option value="">Select City</option>
                  {cityCodes.map(city => (
                    <option key={city.code} value={city.code}>{city.city} ({city.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>File Manager</Label>
                <select 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.fileManager}
                  onChange={(e) => setFormData({...formData, fileManager: e.target.value})}
                >
                  <option value="">Select Manager</option>
                  {fileManagers.map(manager => (
                    <option key={manager.code} value={manager.code}>{manager.name} ({manager.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Month</Label>
                <Input 
                  type="text" 
                  placeholder="06"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                />
              </div>

              <div>
                <Label>Year</Label>
                <Input 
                  type="text" 
                  placeholder="23"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                />
              </div>

              <div>
                <Label>Agent/Operator</Label>
                <select 
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.operator}
                  onChange={(e) => setFormData({...formData, operator: e.target.value})}
                >
                  <option value="">Select Agent</option>
                  {agentCodes.map(agent => (
                    <option key={agent.code} value={agent.code}>{agent.name} ({agent.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Sequence</Label>
                <Input 
                  type="text" 
                  placeholder="0001"
                  value={formData.sequence}
                  onChange={(e) => setFormData({...formData, sequence: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={generateFileCode} className="w-full">
              Generate Code
            </Button>

            {generatedCode && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-gray-600 mb-2">Generated File Code:</p>
                <p className="text-2xl text-purple-700">{generatedCode}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reference Images */}
        <Card>
          <CardHeader>
            <CardTitle>File Code Reference Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <img src={exampleImage1} alt="File Code Structure" className="w-full" />
              </div>
              <p className="text-sm text-gray-600">
                Example format: DL-RK-06-23-ST-0001
                <br />
                City | File Manager | Month | Year | Operator | Sequence
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Tables */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Code Reference Tables</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="city">
            <TabsList>
              <TabsTrigger value="city">City Codes</TabsTrigger>
              <TabsTrigger value="manager">File Managers</TabsTrigger>
              <TabsTrigger value="agent">Agent Codes</TabsTrigger>
            </TabsList>

            <TabsContent value="city">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {cityCodes.filter(c => 
                  c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.code.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(city => (
                  <div key={city.code} className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span>{city.city}</span>
                      <Badge variant="outline">{city.code}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="manager">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {fileManagers.filter(m => 
                  m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.code.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(manager => (
                  <div key={manager.code} className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span>{manager.name}</span>
                      <Badge variant="outline" className="bg-green-50">{manager.code}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agent">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {agentCodes.filter(a => 
                  a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.code.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(agent => (
                  <div key={agent.code} className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{agent.name}</span>
                      <Badge variant="outline" className="bg-yellow-50">{agent.code}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* File Cover Template */}
      <Card>
        <CardHeader>
          <CardTitle>File Cover Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <img src={exampleImage2} alt="File Cover Template" className="w-full" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Filled Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
