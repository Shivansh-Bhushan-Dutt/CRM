import { ArrowLeft, Mail, Bell, FileText, Plane, Hotel, Users, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BookingDetailProps {
  bookingId: string | null;
  onBack: () => void;
}

export function BookingDetail({ bookingId, onBack }: BookingDetailProps) {
  const booking = null; // Will be fetched from API

  if (!booking) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <p className="mt-4 text-gray-600">Booking not found</p>
      </div>
    );
  }

  const getfileStatusColor = (fileStatus: string) => {
    switch (fileStatus) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{booking.tourName}</h1>
            <Badge className={`${getfileStatusColor(booking.filefileStatus)} border`}>
              {booking.filefileStatus}
            </Badge>
          </div>
          <p className="text-gray-600">Booking ID: {booking.id} • PNR: {booking.pnr}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Set Reminder
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Customer Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold mb-4">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Customer Name</p>
            <p className="font-medium">{booking.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Passengers</p>
            <p className="font-medium">{booking.pax} PAX</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Country</p>
            <p className="font-medium">{booking.clientCountry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Agent</p>
            <p className="font-medium">{booking.ManagerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tour Start Date</p>
            <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tour End Date</p>
            <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-semibold text-purple-600">₹{(booking.revenue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Room Nights</p>
              <p className="text-xl font-semibold">{booking.roomNights}</p>
            </div>
            <Hotel className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tickets</p>
              <p className="text-xl font-semibold">{booking.tickets}</p>
            </div>
            <Plane className="w-8 h-8 text-cyan-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cities</p>
              <p className="text-xl font-semibold">{booking.cities.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-indigo-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="timeline">Communication Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="passengers">Passengers</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Linked Tickets</h3>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plane className="w-4 h-4 mr-2" />
                Add Ticket
              </Button>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Flight</Badge>
                      <span className="font-mono text-sm">{booking.pnr}</span>
                    </div>
                    <p className="text-sm font-medium">Delhi → Jaipur</p>
                    <p className="text-sm text-gray-600">15 Jan 2025 • AI 5432 • {booking.pax} Passengers</p>
                  </div>
                  <Plane className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Hotel</Badge>
                    </div>
                    <p className="text-sm font-medium">{booking.hotels[0]}</p>
                    <p className="text-sm text-gray-600">15-17 Jan 2025 • 3 Rooms</p>
                  </div>
                  <Hotel className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Communication Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">Booking Confirmation Sent</p>
                    <span className="text-sm text-gray-500">10:30 AM Today</span>
                  </div>
                  <p className="text-sm text-gray-600">Email sent to {booking.clientName}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">Payment Received</p>
                    <span className="text-sm text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600">₹{(booking.revenue / 1000).toFixed(0)}K received via bank transfer</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">Booking Created</p>
                    <span className="text-sm text-gray-500">3 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Created by {booking.ManagerName}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-center">Document {i}.pdf</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passengers">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Passenger List</h3>
            <p className="text-gray-600">Total Passengers: {booking.pax}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
