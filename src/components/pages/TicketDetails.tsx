import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  CreditCard,
  FileText,
  Download,
  Mail,
  ExternalLink,
  Edit
} from 'lucide-react';

const ticket = {
  id: 'TKT-8234',
  type: 'flight',
  fileStatus: 'confirmed',
  pnr: 'XYZ789',
  bookingReference: 'BK2847',
  
  airline: 'SpiceJet',
  flightNumber: 'SG-456',
  
  origin: {
    city: 'Delhi',
    airport: 'Indira Gandhi International Airport',
    code: 'DEL',
    terminal: 'Terminal 3'
  },
  
  destination: {
    city: 'Bangalore',
    airport: 'Kempegowda International Airport',
    code: 'BLR',
    terminal: 'Terminal 1'
  },
  
  departure: {
    date: 'Nov 28, 2024',
    time: '09:15',
    datetime: 'Thursday, November 28, 2024 at 9:15 AM'
  },
  
  arrival: {
    date: 'Nov 28, 2024',
    time: '12:30',
    datetime: 'Thursday, November 28, 2024 at 12:30 PM'
  },
  
  duration: '3h 15m',
  stops: 'Non-stop',
  
  passengers: [
    {
      name: 'Mr. Rajesh Kumar',
      type: 'Adult',
      seatNumber: '12A',
      ticketNumber: 'SG-456-001234567'
    }
  ],
  
  class: 'Economy',
  fare: {
    baseFare: '5,200',
    taxes: '1,650',
    total: '6,850'
  },
  
  baggage: {
    checkin: '15 kg',
    cabin: '7 kg'
  },
  
  emailSource: 'booking@spicejet.com',
  emailDate: 'Nov 17, 2024, 09:20 AM',
  parsedDate: 'Nov 17, 2024, 09:25 AM',
  attachments: ['ticket_XYZ789.pdf', 'invoice_XYZ789.pdf']
};

export function TicketDetails() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Ticket Details</h1>
          <p className="text-gray-600">Complete information for ticket #{ticket.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Mail className="w-4 h-4 mr-2" />
            Email to Customer
          </Button>
        </div>
      </div>

      {/* fileStatus Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600 text-white text-lg px-4 py-1">
                  {ticket.type.toUpperCase()}
                </Badge>
                <Badge className="bg-green-500 text-white text-lg px-4 py-1">
                  {ticket.fileStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <p className="text-sm text-gray-600">PNR</p>
                <p className="text-xl">{ticket.pnr}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking Reference</p>
                <p className="text-xl">{ticket.bookingReference}</p>
              </div>
            </div>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Booking
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flight Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Flight Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Airline</p>
              <p className="text-xl">{ticket.airline}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Flight Number</p>
              <p className="text-xl">{ticket.flightNumber}</p>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="relative py-8">
            <div className="flex items-center justify-between">
              {/* Origin */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl">{ticket.origin.code}</p>
                    <p className="text-sm text-gray-600">{ticket.origin.city}</p>
                  </div>
                </div>
                <div className="ml-16 space-y-1 text-sm">
                  <p className="text-gray-600">{ticket.origin.airport}</p>
                  <p className="text-gray-600">{ticket.origin.terminal}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{ticket.departure.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-lg">{ticket.departure.time}</span>
                  </div>
                </div>
              </div>

              {/* Flight Path */}
              <div className="flex-1 flex flex-col items-center px-8">
                <div className="relative w-full">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></div>
                  <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-600 rotate-90" />
                </div>
                <div className="mt-8 text-center space-y-1">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p>{ticket.duration}</p>
                  <p className="text-sm text-gray-600">{ticket.stops}</p>
                </div>
              </div>

              {/* Destination */}
              <div className="flex-1 text-right">
                <div className="flex items-center gap-3 mb-2 justify-end">
                  <div>
                    <p className="text-2xl">{ticket.destination.code}</p>
                    <p className="text-sm text-gray-600">{ticket.destination.city}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mr-16 space-y-1 text-sm">
                  <p className="text-gray-600">{ticket.destination.airport}</p>
                  <p className="text-gray-600">{ticket.destination.terminal}</p>
                  <div className="flex items-center gap-2 mt-2 justify-end">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{ticket.arrival.date}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-lg">{ticket.arrival.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Passenger Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Passenger Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticket.passengers.map((passenger, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p>{passenger.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p>{passenger.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Seat Number</p>
                      <p>{passenger.seatNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ticket Number</p>
                      <p className="text-xs">{passenger.ticketNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Class</p>
                <p>{ticket.class}</p>
              </div>
              <div>
                <p className="text-gray-600">Baggage Allowance</p>
                <p>Check-in: {ticket.baggage.checkin}</p>
                <p>Cabin: {ticket.baggage.cabin}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fare Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Fare Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Base Fare</span>
                <span>₹ {ticket.fare.baseFare}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Taxes & Fees</span>
                <span>₹ {ticket.fare.taxes}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg">Total Amount</span>
                <span className="text-2xl text-purple-600">₹ {ticket.fare.total}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">Payment fileStatus</p>
              <Badge className="bg-green-500 text-white">Paid</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Source & Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Email Source</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{ticket.emailSource}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{ticket.emailDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Parsed Date</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{ticket.parsedDate}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Attachments</p>
              <div className="space-y-2">
                {ticket.attachments.map((attachment, index) => (
                  <Button key={index} variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    {attachment}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Original Email
            </Button>
            <Button variant="outline" className="ml-2">
              <FileText className="w-4 h-4 mr-2" />
              View All Documents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
