import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface BookingsPageProps {
  onSelectBooking: (id: string) => void;
}

export function BookingsPage({ onSelectBooking }: BookingsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const tourFiles: any[] = []; // Will be fetched from API

  const filteredBookings = tourFiles.filter(tour =>
    tour.tourName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.pnr?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-gray-600 mt-1">{filteredBookings.length} bookings found</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by PNR, booking ID, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PNR</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">fileStatus</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onSelectBooking(booking.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{booking.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{booking.clientName}</div>
                    <div className="text-sm text-gray-500">{booking.pax} PAX</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{booking.tourName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm">{booking.pnr}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${getfileStatusColor(booking.fileStatus)} border`}>
                    {booking.fileStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-purple-600">₹{(booking.revenue / 1000).toFixed(0)}K</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-purple-600 hover:underline text-sm">View Details</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
