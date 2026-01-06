import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Mail, 
  Search, 
  Paperclip, 
  Star, 
  Archive, 
  Trash2,
  Clock,
  User,
  Plane,
  Train,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const emails = [
  {
    id: 1,
    from: 'booking@spicejet.com',
    subject: 'Flight Booking Confirmation - PNR ABC123',
    preview: 'Your flight from Delhi to Mumbai has been confirmed...',
    time: '5 mins ago',
    read: false,
    attachments: 2,
    starred: true,
    parsed: true,
    type: 'flight'
  },
  {
    id: 2,
    from: 'noreply@irctc.co.in',
    subject: 'Train Ticket Booked - IRCTC #7654321',
    preview: 'Your train ticket has been successfully booked...',
    time: '12 mins ago',
    read: false,
    attachments: 1,
    starred: false,
    parsed: true,
    type: 'train'
  },
  {
    id: 3,
    from: 'reservations@tajhotels.com',
    subject: 'Hotel Confirmation - Taj Palace Delhi',
    preview: 'Thank you for choosing Taj Hotels. Your reservation...',
    time: '23 mins ago',
    read: false,
    attachments: 1,
    starred: false,
    parsed: false,
    type: 'hotel'
  },
  {
    id: 4,
    from: 'support@makemytrip.com',
    subject: 'Itinerary for Trip ID MMT12345',
    preview: 'Find your complete travel itinerary attached...',
    time: '45 mins ago',
    read: true,
    attachments: 3,
    starred: false,
    parsed: true,
    type: 'itinerary'
  },
  {
    id: 5,
    from: 'customer@gmail.com',
    subject: 'Query regarding booking amendment',
    preview: 'Hi, I need to change my flight dates for the upcoming...',
    time: '1 hour ago',
    read: true,
    attachments: 0,
    starred: false,
    parsed: false,
    type: 'query'
  },
];

const selectedEmailData = {
  id: 1,
  from: 'booking@spicejet.com',
  to: 'operations@immerseindiatours.com',
  subject: 'Flight Booking Confirmation - PNR ABC123',
  date: 'Nov 18, 2024, 10:45 AM',
  body: `Dear Customer,

Thank you for choosing SpiceJet. Your flight booking has been confirmed.

Booking Details:
- PNR: ABC123
- Flight: SG-234
- Route: Delhi (DEL) → Mumbai (BOM)
- Departure: Nov 25, 2024 at 14:30
- Arrival: Nov 25, 2024 at 16:45
- Passenger: Mr. Rajesh Kumar
- Class: Economy
- Fare: ₹4,850

Please arrive at the airport 2 hours before departure.

Best Regards,
SpiceJet Team`,
  attachments: [
    { name: 'ticket_ABC123.pdf', size: '245 KB', type: 'application/pdf' },
    { name: 'invoice_ABC123.pdf', size: '128 KB', type: 'application/pdf' }
  ]
};

export function EmailInbox() {
  const [selectedEmail, setSelectedEmail] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-full flex">
      {/* Email List */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              All
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Unread
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Starred
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-100">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedEmail === email.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                } ${!email.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Mail className={`w-4 h-4 flex-shrink-0 ${!email.read ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className={`text-sm truncate ${!email.read ? '' : 'text-gray-600'}`}>
                      {email.from}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {email.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    {email.parsed && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <p className={`text-sm mb-1 ${!email.read ? '' : 'text-gray-600'}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-gray-500 truncate mb-2">{email.preview}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{email.time}</span>
                  </div>
                  {email.attachments > 0 && (
                    <div className="flex items-center gap-1">
                      <Paperclip className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{email.attachments}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex">
        <div className="flex-1 bg-white flex flex-col">
          {/* Email Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl mb-2">{selectedEmailData.subject}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedEmailData.from}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEmailData.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Attachments */}
            {selectedEmailData.attachments.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedEmailData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{attachment.name}</span>
                    <span className="text-xs text-gray-500">{attachment.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Body */}
          <ScrollArea className="flex-1 p-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap">{selectedEmailData.body}</pre>
            </div>

            {/* Conversation Timeline */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm mb-4">Conversation History</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    RK
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">Raghwendra Kumar</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-600">Processed and linked to booking #BK2847</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Reply Section */}
          <div className="p-4 border-t border-gray-200">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500">
              Reply
            </Button>
            <Button variant="outline" className="ml-2">
              Forward
            </Button>
          </div>
        </div>

        {/* Smart Insights Panel */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
          <h3 className="text-lg mb-4">Smart Insights</h3>

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Parsing fileStatus</span>
              </div>
              <Badge className="bg-green-500">Successfully Parsed</Badge>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h4 className="text-sm mb-3">Detected PNRs</h4>
              <div className="space-y-2">
                <div className="p-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ABC123</span>
                    <Badge variant="outline" className="text-xs">Flight</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h4 className="text-sm mb-3">Ticket Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-purple-600" />
                  <div className="flex-1">
                    <p>Flight: SG-234</p>
                    <p className="text-xs text-gray-500">DEL → BOM</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Passenger</p>
                  <p>Mr. Rajesh Kumar</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Travel Date</p>
                  <p>Nov 25, 2024 at 14:30</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Fare</p>
                  <p>₹4,850</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h4 className="text-sm mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Booking
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Customer Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm mb-3">Attachment Preview</h4>
              <div className="space-y-2">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 text-center">ticket_ABC123.pdf</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
