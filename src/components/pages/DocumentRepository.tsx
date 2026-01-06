import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Upload,
  Plane,
  Train,
  Hotel,
  Bus,
  FileCheck,
  Calendar,
  User,
  Grid3x3,
  List
} from 'lucide-react';

const documents = [
  {
    id: 1,
    name: 'Flight_Ticket_XYZ789.pdf',
    type: 'airline',
    category: 'Air Ticket',
    uploadDate: '2024-11-17',
    uploadedBy: 'Raghwendra Kumar',
    bookingRef: 'BK2847',
    customer: 'Mr. Rajesh Kumar',
    size: '245 KB',
    fileStatus: 'verified'
  },
  {
    id: 2,
    name: 'Hotel_Voucher_DEF123.pdf',
    type: 'hotel',
    category: 'Hotel Voucher',
    uploadDate: '2024-11-17',
    uploadedBy: 'Madhu Chaudhary',
    bookingRef: 'BK2847',
    customer: 'Mr. Rajesh Kumar',
    size: '189 KB',
    fileStatus: 'verified'
  },
  {
    id: 3,
    name: 'Train_Ticket_ABC456.pdf',
    type: 'railway',
    category: 'Rail Ticket',
    uploadDate: '2024-11-16',
    uploadedBy: 'Raghwendra Kumar',
    bookingRef: 'BK2801',
    customer: 'Ms. Priya Sharma',
    size: '312 KB',
    fileStatus: 'pending'
  },
  {
    id: 4,
    name: 'Itinerary_BK2645.pdf',
    type: 'itinerary',
    category: 'Itinerary',
    uploadDate: '2024-11-15',
    uploadedBy: 'Raghwendra Kumar',
    bookingRef: 'BK2645',
    customer: 'Mr. Amit Verma',
    size: '456 KB',
    fileStatus: 'verified'
  },
  {
    id: 5,
    name: 'Invoice_BK2645.pdf',
    type: 'bill',
    category: 'Invoice',
    uploadDate: '2024-11-15',
    uploadedBy: 'System',
    bookingRef: 'BK2645',
    customer: 'Mr. Amit Verma',
    size: '128 KB',
    fileStatus: 'verified'
  },
  {
    id: 6,
    name: 'Bus_Ticket_GHI789.pdf',
    type: 'bus',
    category: 'Bus Ticket',
    uploadDate: '2024-11-14',
    uploadedBy: 'Sumesh Sudharasan',
    bookingRef: 'BK2598',
    customer: 'Mrs. Kavita Patel',
    size: '167 KB',
    fileStatus: 'verified'
  },
  {
    id: 7,
    name: 'Passport_Copy_Customer123.pdf',
    type: 'other',
    category: 'Customer Documents',
    uploadDate: '2024-11-12',
    uploadedBy: 'Raghwendra Kumar',
    bookingRef: '-',
    customer: 'Mr. Rajesh Kumar',
    size: '1.2 MB',
    fileStatus: 'verified'
  },
  {
    id: 8,
    name: 'Visa_Application_Form.pdf',
    type: 'other',
    category: 'Visa Documents',
    uploadDate: '2024-11-10',
    uploadedBy: 'Madhu Chaudhary',
    bookingRef: 'BK2456',
    customer: 'Ms. Deepa Singh',
    size: '890 KB',
    fileStatus: 'pending'
  }
];

const documentStats = [
  { type: 'airline', label: 'Airline Tickets', count: 245, icon: Plane },
  { type: 'railway', label: 'Railway Tickets', count: 189, icon: Train },
  { type: 'hotel', label: 'Hotel Vouchers', count: 156, icon: Hotel },
  { type: 'bus', label: 'Bus Tickets', count: 78, icon: Bus },
  { type: 'itinerary', label: 'Itineraries', count: 234, icon: FileText },
  { type: 'bill', label: 'Bills & Invoices', count: 198, icon: FileCheck },
];

export function DocumentRepository() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.bookingRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'airline': return Plane;
      case 'railway': return Train;
      case 'hotel': return Hotel;
      case 'bus': return Bus;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'airline': return 'bg-purple-100 text-purple-600';
      case 'railway': return 'bg-blue-100 text-blue-600';
      case 'hotel': return 'bg-orange-100 text-orange-600';
      case 'bus': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Document Repository</h1>
          <p className="text-gray-600">Centralized storage for all travel documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {documentStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.type} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    stat.type === 'airline' ? 'bg-purple-100' :
                    stat.type === 'railway' ? 'bg-blue-100' :
                    stat.type === 'hotel' ? 'bg-orange-100' :
                    stat.type === 'bus' ? 'bg-green-100' :
                    stat.type === 'itinerary' ? 'bg-yellow-100' :
                    'bg-pink-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      stat.type === 'airline' ? 'text-purple-600' :
                      stat.type === 'railway' ? 'text-blue-600' :
                      stat.type === 'hotel' ? 'text-orange-600' :
                      stat.type === 'bus' ? 'text-green-600' :
                      stat.type === 'itinerary' ? 'text-yellow-600' :
                      'text-pink-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-2xl">{stat.count}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by document name, customer, or booking reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="airline">Airline Tickets</SelectItem>
                <SelectItem value="railway">Railway Tickets</SelectItem>
                <SelectItem value="hotel">Hotel Vouchers</SelectItem>
                <SelectItem value="bus">Bus Tickets</SelectItem>
                <SelectItem value="itinerary">Itineraries</SelectItem>
                <SelectItem value="bill">Bills & Invoices</SelectItem>
                <SelectItem value="other">Others</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => {
            const Icon = getTypeIcon(doc.type);
            return (
              <Card key={doc.id} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getTypeColor(doc.type)}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {doc.category}
                      </Badge>
                      <Badge className={doc.fileStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {doc.fileStatus}
                      </Badge>
                    </div>
                    
                    <p className="text-sm truncate" title={doc.name}>
                      {doc.name}
                    </p>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{doc.customer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{doc.bookingRef}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{doc.size}</span>
                      <span className="text-xs text-gray-500">{doc.uploadedBy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const Icon = getTypeIcon(doc.type);
                return (
                  <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(doc.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm truncate">{doc.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                          <Badge className={doc.fileStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {doc.fileStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{doc.customer}</span>
                          <span>•</span>
                          <span>Booking: {doc.bookingRef}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>By: {doc.uploadedBy}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
