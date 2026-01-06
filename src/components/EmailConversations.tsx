import { useState } from 'react';
import { Search, Mail, Paperclip, Star, Archive, Trash2, Reply, Forward, MoreVertical, FileText, Plane, Hotel as HotelIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  pnrs?: string[];
  bookingId?: string;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'smith.family@email.com',
    subject: 'Re: Golden Triangle Tour Booking Confirmation',
    preview: 'Thank you for the confirmation. Could you please send us the hotel vouchers...',
    date: '10:30 AM',
    read: false,
    starred: true,
    hasAttachment: true,
    pnrs: ['PNR2025001', 'AI5432'],
    bookingId: 'TF001'
  },
  {
    id: '2',
    from: 'johnson.group@email.com',
    subject: 'Flight tickets for Rajasthan Tour',
    preview: 'Attached are the scanned copies of our passports for the flight booking...',
    date: 'Yesterday',
    read: true,
    starred: false,
    hasAttachment: true,
    pnrs: ['PNR2024089'],
    bookingId: 'TF002'
  },
  {
    id: '3',
    from: 'williams@email.com',
    subject: 'Kerala Tour - Payment Confirmation',
    preview: 'We have made the payment as discussed. Please find the transaction receipt...',
    date: 'Dec 18',
    read: true,
    starred: false,
    hasAttachment: true,
    bookingId: 'TF003'
  },
  {
    id: '4',
    from: 'brown.family@email.com',
    subject: 'Himalayan Adventure - Special requests',
    preview: 'We would like to request vegetarian meals for all passengers and...',
    date: 'Dec 15',
    read: false,
    starred: false,
    hasAttachment: false,
    bookingId: 'TF004'
  }
];

export function EmailConversations() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(mockEmails[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = mockEmails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Left Panel - Email List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.map((email) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedEmail(email)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedEmail?.id === email.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
              } ${!email.read ? 'bg-blue-50/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Mail className={`w-4 h-4 flex-shrink-0 ${!email.read ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`text-sm truncate ${!email.read ? 'font-semibold' : ''}`}>
                    {email.from}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {email.starred && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                  {email.hasAttachment && <Paperclip className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              <h4 className={`text-sm mb-1 truncate ${!email.read ? 'font-semibold' : ''}`}>
                {email.subject}
              </h4>
              <p className="text-xs text-gray-500 truncate mb-1">{email.preview}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{email.date}</span>
                {email.pnrs && (
                  <Badge variant="outline" className="text-xs">
                    {email.pnrs.length} PNR{email.pnrs.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Center Panel - Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="font-semibold mb-1">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{selectedEmail.from}</span>
                    <span>•</span>
                    <span>{selectedEmail.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Button size="sm" variant="outline">
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {selectedEmail.preview}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Please let us know if you need any additional information. We look forward to hearing from you soon.
                </p>
                <p className="text-gray-700 mt-6">
                  Best regards,<br />
                  {selectedEmail.from.split('@')[0]}
                </p>

                {selectedEmail.hasAttachment && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold mb-3">Attachments (3)</h4>
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">passport-scan.pdf</p>
                          <p className="text-xs text-gray-500">2.3 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">visa-copy.pdf</p>
                          <p className="text-xs text-gray-500">1.8 MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">payment-receipt.pdf</p>
                          <p className="text-xs text-gray-500">945 KB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select an email to view</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Smart Insights */}
      <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
        {selectedEmail ? (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Smart Insights</h3>
            </div>

            {/* Detected PNRs */}
            {selectedEmail.pnrs && selectedEmail.pnrs.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-semibold">Detected PNRs</h4>
                </div>
                <div className="space-y-2">
                  {selectedEmail.pnrs.map(pnr => (
                    <div key={pnr} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{pnr}</span>
                      <Button size="sm" variant="ghost" className="h-6 text-xs">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parsed Ticket Summary */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold">Parsed Tickets</h4>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <Badge variant="outline" className="mb-2">Flight Ticket</Badge>
                  <p className="text-xs text-gray-600">Delhi → Jaipur</p>
                  <p className="text-xs text-gray-600">AI 5432 • 15 Jan 2025</p>
                  <p className="text-xs text-gray-600">6 Passengers</p>
                </div>
                <div className="text-sm">
                  <Badge variant="outline" className="mb-2">Hotel Booking</Badge>
                  <p className="text-xs text-gray-600">Taj Palace Hotel</p>
                  <p className="text-xs text-gray-600">15-17 Jan 2025 • 3 Rooms</p>
                </div>
              </div>
            </div>

            {/* Linked Booking */}
            {selectedEmail.bookingId && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <HotelIcon className="w-4 h-4 text-cyan-600" />
                  <h4 className="text-sm font-semibold">Linked Booking</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tour File #{selectedEmail.bookingId}</span>
                    <Button size="sm" variant="ghost" className="h-6 text-xs text-purple-600">
                      Open
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">Golden Triangle Deluxe</p>
                  <p className="text-xs text-gray-600">Client: Smith Family</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Booking
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plane className="w-4 h-4 mr-2" />
                  Add Ticket
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <HotelIcon className="w-4 h-4 mr-2" />
                  Add Hotel
                </Button>
              </div>
            </div>

            {/* Attachment Preview */}
            {selectedEmail.hasAttachment && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-semibold mb-3">Attachment Preview</h4>
                <div className="space-y-2">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 text-center">passport-scan.pdf</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">No email selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
