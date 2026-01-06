import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  Download, 
  Save, 
  X, 
  AlertCircle,
  CheckCircle,
  Wand2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const pendingDocuments = [
  { id: 1, name: 'Flight_Ticket_XYZ789.pdf', type: 'Flight', confidence: 65, date: '2024-11-18' },
  { id: 2, name: 'Train_Ticket_ABC456.pdf', type: 'Train', confidence: 58, date: '2024-11-18' },
  { id: 3, name: 'Hotel_Voucher_DEF123.pdf', type: 'Hotel', confidence: 72, date: '2024-11-17' },
  { id: 4, name: 'Bus_Ticket_GHI789.pdf', type: 'Bus', confidence: 45, date: '2024-11-17' },
];

export function ManualParsing() {
  const [selectedDoc, setSelectedDoc] = useState(pendingDocuments[0]);
  const [zoom, setZoom] = useState(100);
  const [formData, setFormData] = useState({
    ticketType: 'flight',
    passengerName: 'Mr. Rajesh Kumar',
    airline: 'SpiceJet',
    pnr: 'XYZ789',
    flightNumber: 'SG-456',
    source: 'Delhi',
    destination: 'Bangalore',
    departureDate: '2024-11-28',
    departureTime: '09:15',
    arrivalDate: '2024-11-28',
    arrivalTime: '12:30',
    travelClass: 'Economy',
    fare: '6,850',
    bookingReference: 'BK12345'
  });

  const handleAutoFill = () => {
    // Simulate auto-fill with AI suggestions
    alert('Auto-filled with AI suggestions!');
  };

  const handleSave = () => {
    alert('Corrections saved successfully!');
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this document?')) {
      alert('Document rejected');
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Manual Parsing Review</h1>
          <p className="text-gray-600">Review and correct low-confidence document parsing</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {pendingDocuments.length} Pending Reviews
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Document Queue */}
        <Card className="overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Pending Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-gray-200">
              {pendingDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedDoc.id === doc.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm truncate flex-1">{doc.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                    <div className="flex items-center gap-1">
                      <AlertCircle className={`w-3 h-3 ${
                        doc.confidence < 60 ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <span className="text-xs text-gray-500">{doc.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{doc.date}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Preview */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Document Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 w-16 text-center">{zoom}%</span>
                <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 bg-gray-100">
            <div 
              className="bg-white shadow-lg mx-auto p-8 rounded-lg"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {/* Mock PDF Preview */}
              <div className="space-y-4">
                <div className="text-center border-b border-gray-300 pb-4">
                  <h2 className="text-2xl text-orange-600">SpiceJet</h2>
                  <p className="text-sm text-gray-600">E-Ticket Receipt</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">PNR</p>
                    <p>XYZ789</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Booking Reference</p>
                    <p>BK12345</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Passenger Name</p>
                    <p>MR RAJESH KUMAR</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Flight</p>
                    <p>SG-456</p>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Flight Details</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg">Delhi (DEL)</p>
                      <p className="text-sm text-gray-600">09:15, 28 Nov 2024</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">3h 15m</p>
                      <div className="w-16 h-px bg-gray-300 my-1"></div>
                      <p className="text-xs text-gray-500">Non-stop</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg">Bangalore (BLR)</p>
                      <p className="text-sm text-gray-600">12:30, 28 Nov 2024</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Class</p>
                    <p>Economy</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fare</p>
                    <p>₹ 6,850</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editing Form */}
        <Card className="overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Extracted Fields</CardTitle>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">{selectedDoc.confidence}% confidence</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <Label>Ticket Type</Label>
              <Select value={formData.ticketType} onValueChange={(value) => setFormData({...formData, ticketType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Passenger Name</Label>
              <Input 
                value={formData.passengerName}
                onChange={(e) => setFormData({...formData, passengerName: e.target.value})}
              />
            </div>

            <div>
              <Label>Airline / Railway</Label>
              <Input 
                value={formData.airline}
                onChange={(e) => setFormData({...formData, airline: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>PNR</Label>
                <Input 
                  value={formData.pnr}
                  onChange={(e) => setFormData({...formData, pnr: e.target.value})}
                />
              </div>
              <div>
                <Label>Flight/Train Number</Label>
                <Input 
                  value={formData.flightNumber}
                  onChange={(e) => setFormData({...formData, flightNumber: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Source</Label>
                <Input 
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                />
              </div>
              <div>
                <Label>Destination</Label>
                <Input 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Departure Date</Label>
                <Input 
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Departure Time</Label>
                <Input 
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Arrival Date</Label>
                <Input 
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Arrival Time</Label>
                <Input 
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Class</Label>
                <Input 
                  value={formData.travelClass}
                  onChange={(e) => setFormData({...formData, travelClass: e.target.value})}
                />
              </div>
              <div>
                <Label>Fare (₹)</Label>
                <Input 
                  value={formData.fare}
                  onChange={(e) => setFormData({...formData, fare: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Booking Reference</Label>
              <Input 
                value={formData.bookingReference}
                onChange={(e) => setFormData({...formData, bookingReference: e.target.value})}
              />
            </div>

            <div className="pt-4 space-y-2 border-t border-gray-200">
              <Button onClick={handleAutoFill} variant="outline" className="w-full">
                <Wand2 className="w-4 h-4 mr-2" />
                Auto-fill Suggestions
              </Button>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-blue-500">
                <Save className="w-4 h-4 mr-2" />
                Save Corrections
              </Button>
              <Button onClick={handleReject} variant="destructive" className="w-full">
                <X className="w-4 h-4 mr-2" />
                Reject Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
