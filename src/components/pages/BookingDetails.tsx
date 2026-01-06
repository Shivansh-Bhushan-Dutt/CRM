import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Plane,
  Train,
  Hotel,
  Bus,
  Plus,
  Send,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Edit
} from 'lucide-react';

const booking = {
  id: 'BK2847',
  fileStatus: 'confirmed',
  fileCode: 'DL-RK-06-23-ST-0001',
  customer: {
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    address: 'Delhi, India'
  },
  bookingDate: 'Nov 15, 2024',
  travelDate: 'Nov 28, 2024',
  totalAmount: '₹45,850'
};

const tickets = [
  {
    id: 1,
    type: 'flight',
    title: 'Delhi to Bangalore',
    provider: 'SpiceJet SG-456',
    pnr: 'XYZ789',
    date: 'Nov 28, 2024',
    time: '09:15',
    fileStatus: 'confirmed',
    passengers: ['Mr. Rajesh Kumar'],
    class: 'Economy',
    fare: '₹6,850'
  },
  {
    id: 2,
    type: 'hotel',
    title: 'The Taj Hotel, Bangalore',
    provider: 'Taj Hotels',
    pnr: 'HTL5643',
    date: 'Nov 28-30, 2024',
    time: 'Check-in: 14:00',
    fileStatus: 'confirmed',
    passengers: ['Mr. Rajesh Kumar'],
    class: 'Deluxe Room',
    fare: '₹18,000'
  },
  {
    id: 3,
    type: 'flight',
    title: 'Bangalore to Delhi',
    provider: 'IndiGo 6E-789',
    pnr: 'ABC456',
    date: 'Nov 30, 2024',
    time: '18:30',
    fileStatus: 'confirmed',
    passengers: ['Mr. Rajesh Kumar'],
    class: 'Economy',
    fare: '₹7,500'
  }
];

const communications = [
  {
    id: 1,
    type: 'email',
    subject: 'Booking confirmation sent',
    from: 'operations@immerseindiatours.com',
    to: 'rajesh.kumar@email.com',
    date: 'Nov 15, 2024, 11:30 AM',
    attachments: ['confirmation.pdf']
  },
  {
    id: 2,
    type: 'note',
    subject: 'Customer requested vegetarian meals',
    from: 'Raghwendra Kumar',
    date: 'Nov 16, 2024, 03:45 PM',
  },
  {
    id: 3,
    type: 'email',
    subject: 'Flight tickets received',
    from: 'booking@spicejet.com',
    date: 'Nov 17, 2024, 09:20 AM',
    attachments: ['ticket_XYZ789.pdf']
  },
  {
    id: 4,
    type: 'document',
    subject: 'Hotel voucher uploaded',
    from: 'System',
    date: 'Nov 17, 2024, 02:15 PM',
  }
];

const reminders = [
  { id: 1, title: 'Send final itinerary to customer', date: 'Nov 20, 2024', priority: 'high' },
  { id: 2, title: 'Confirm hotel check-in', date: 'Nov 27, 2024', priority: 'medium' },
  { id: 3, title: 'Follow-up after trip', date: 'Dec 1, 2024', priority: 'low' }
];

export function BookingDetails() {
  const getfileStatusColor = (fileStatus: string) => {
    switch (fileStatus) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTicketIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'train': return Train;
      case 'hotel': return Hotel;
      case 'bus': return Bus;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Booking Details</h1>
          <p className="text-gray-600">Complete information for booking #{booking.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Booking Header */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">Booking ID</span>
              </div>
              <p className="text-xl">{booking.id}</p>
              <p className="text-sm text-gray-500 mt-1">File: {booking.fileCode}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">fileStatus</span>
              </div>
              <Badge className={`${getfileStatusColor(booking.fileStatus)} text-white capitalize`}>
                {booking.fileStatus}
              </Badge>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Travel Date</span>
              </div>
              <p className="text-xl">{booking.travelDate}</p>
              <p className="text-sm text-gray-500 mt-1">Booked: {booking.bookingDate}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">Total Amount</span>
              </div>
              <p className="text-xl">{booking.totalAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p>{booking.customer.name}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{booking.customer.address}</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full Profile
            </Button>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Reminders & Follow-ups
              </CardTitle>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${
                      reminder.priority === 'high' ? 'text-red-500' :
                      reminder.priority === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`} />
                    <div>
                      <p className="text-sm">{reminder.title}</p>
                      <p className="text-xs text-gray-500">{reminder.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    reminder.priority === 'high' ? 'border-red-300 text-red-600' :
                    reminder.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                    'border-green-300 text-green-600'
                  }>
                    {reminder.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets & Communications */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="tickets">
            <TabsList>
              <TabsTrigger value="tickets">Linked Tickets ({tickets.length})</TabsTrigger>
              <TabsTrigger value="communications">Communications ({communications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="space-y-4 mt-6">
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Ticket
                </Button>
              </div>
              
              {tickets.map((ticket) => {
                const Icon = getTicketIcon(ticket.type);
                return (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            ticket.type === 'flight' ? 'bg-purple-100' :
                            ticket.type === 'hotel' ? 'bg-orange-100' :
                            ticket.type === 'train' ? 'bg-blue-100' :
                            'bg-green-100'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              ticket.type === 'flight' ? 'text-purple-600' :
                              ticket.type === 'hotel' ? 'text-orange-600' :
                              ticket.type === 'train' ? 'text-blue-600' :
                              'text-green-600'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg">{ticket.title}</h3>
                              <Badge className={`${getfileStatusColor(ticket.fileStatus)} text-white`}>
                                {ticket.fileStatus}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Provider</p>
                                <p>{ticket.provider}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">PNR / Reference</p>
                                <p>{ticket.pnr}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Date & Time</p>
                                <p>{ticket.date}</p>
                                <p className="text-xs text-gray-500">{ticket.time}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Class / Type</p>
                                <p>{ticket.class}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {ticket.passengers.join(', ')}
                                </span>
                              </div>
                              <p className="text-lg">{ticket.fare}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="communications" className="space-y-4 mt-6">
              <div className="space-y-3">
                {communications.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      comm.type === 'email' ? 'bg-blue-100' :
                      comm.type === 'note' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      {comm.type === 'email' ? (
                        <Mail className="w-5 h-5 text-blue-600" />
                      ) : comm.type === 'note' ? (
                        <FileText className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm">{comm.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {comm.type === 'email' && `From: ${comm.from} → To: ${comm.to}`}
                            {comm.type === 'note' && `By: ${comm.from}`}
                            {comm.type === 'document' && comm.from}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {comm.date}
                        </span>
                      </div>
                      
                      {comm.attachments && comm.attachments.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {comm.attachments.map((attachment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Plus className="w-5 h-5" />
              <span>Add Ticket</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="w-5 h-5" />
              <span>Generate Invoice</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <FileText className="w-5 h-5" />
              <span>Generate Itinerary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
