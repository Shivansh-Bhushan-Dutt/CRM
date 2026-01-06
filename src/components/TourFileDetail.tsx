import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, MessageSquare, Ticket, Hotel, Users, MapPin, Calendar, Car, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User } from '../App';
import { TourFileCover } from './TourFileCover';
import { tourFileAPI } from '../services/api';

interface TourFileDetailProps {
  tourId: string | null;
  onBack: () => void;
  currentUser: User;
}

export function TourFileDetail({ tourId, onBack, currentUser }: TourFileDetailProps) {
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNewTour, setIsNewTour] = useState(false);
  const conversations: any[] = [];
  const tickets: any[] = [];

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) {
        console.error('❌ No tourId provided');
        setLoading(false);
        setTour(null);
        return;
      }

      // Handle creating new tour file
      if (tourId === 'new') {
        setIsNewTour(true);
        const newTour = {
          id: `new-${Date.now()}`,
          fileCode: `TF${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
          tourName: '',
          clientName: '',
          clientCountry: 'India',
          pax: 1,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'UPCOMING',
          invoiceStatus: 'YET_TO_RAISE',
          pnr: '',
          revenue: 0,
          roomNights: 0,
          manager: { name: currentUser.name, id: currentUser.id },
          agentName: currentUser.name,
          foreignTourOperator: '',
          cities: [],
          hotels: [],
          guides: [],
          guide: '',
          transportType: 'Car',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          conversations: 0,
          tickets: 0
        };
        setTour(newTour);
        setLoading(false);
        return;
      }
      
      // Load existing tour from database (API)
      try {
        setLoading(true);
        setIsNewTour(false);
        
        console.log('🔍 Fetching tour with ID:', tourId);
        console.log('🔍 Tour ID type:', typeof tourId);
        console.log('🔍 API URL will be:', `http://localhost:5000/api/tourfiles/${tourId}`);
        
        const response = await tourFileAPI.getById(tourId);
        console.log('📥 API Response:', response);
        console.log('📥 Response success:', response?.success);
        console.log('📥 Response data:', response?.data);
        
        if (response && response.success && response.data) {
          console.log('✅ Tour data found:', response.data);
          
          // Parse JSON strings to arrays/objects with proper error handling
          const parseCities = () => {
            if (!response.data.cities) return [];
            if (Array.isArray(response.data.cities)) return response.data.cities;
            try {
              const parsed = JSON.parse(response.data.cities);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          };

          const parseHotels = () => {
            if (!response.data.hotels) return [];
            if (Array.isArray(response.data.hotels)) return response.data.hotels;
            try {
              const parsed = JSON.parse(response.data.hotels);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          };

          const parseGuides = () => {
            if (!response.data.guides) return [];
            if (Array.isArray(response.data.guides)) return response.data.guides;
            try {
              const parsed = JSON.parse(response.data.guides);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          };

          const parseItinerary = () => {
            if (!response.data.itinerary) return [];
            if (Array.isArray(response.data.itinerary)) return response.data.itinerary;
            try {
              const parsed = JSON.parse(response.data.itinerary);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          };

          const parsedTour = {
            ...response.data,
            cities: parseCities(),
            hotels: parseHotels(),
            guides: parseGuides(),
            itinerary: parseItinerary()
          };
          
          console.log('📄 Parsed tour:', parsedTour);
          setTour(parsedTour);
        } else {
          console.error('❌ Tour not found - Response:', response);
          console.error('❌ Response details:', {
            success: response?.success,
            hasData: !!response?.data,
            data: response?.data
          });
          setTour(null);
        }
      } catch (error: any) {
        console.error('❌ Failed to load tour:', error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error details:', error);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId, currentUser.name]);
  
  if (loading) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tour Files
        </Button>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="p-6">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tour Files
        </Button>
        <p className="mt-4 text-gray-600">Tour not found</p>
      </div>
    );
  }

  // Check if user can edit this tour
  const canEdit = currentUser.isAdmin || tour.manager?.name === currentUser.name;

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress':
      case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleGeneratePDF = () => {
    // Print the page - browser will handle PDF generation
    window.print();
  };

  const handleDelete = async () => {
    if (!tour || isNewTour) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${tour.tourName}"?\n\nThis will permanently remove this tour file from the database.`
    );
    
    if (!confirmDelete) return;
    
    try {
      console.log('🗑️ Deleting tour file:', tour.id);
      const response = await tourFileAPI.delete(tour.id);
      
      if (response.success) {
        alert('✅ Tour file deleted successfully!');
        // Dispatch event to refresh tour list
        window.dispatchEvent(new Event('tourFilesSaved'));
        // Go back to tour files list
        onBack();
      } else {
        alert('❌ Failed to delete tour file');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`❌ Error deleting tour file: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tour Files
          </Button>
          <h1 className="text-2xl font-semibold">{isNewTour ? 'Create New Tour File' : (tour.tourName || 'Tour File')}</h1>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(tour.status)} border`}>
              {tour.status}
            </Badge>
            {tour.pnr && <span className="text-sm text-gray-600">PNR: {tour.pnr}</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleGeneratePDF} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Generate Complete PDF
          </Button>
        </div>
      </div>

      {/* File Cover Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Tour File Cover</h2>
          <p className="text-sm text-gray-500">
            {isNewTour 
              ? 'Fill in the tour details below and click "Save Changes" to create the tour file' 
              : 'Tour file details - Click "Edit Cover" to modify'}
          </p>
        </div>

        <TourFileCover 
          tour={tour} 
          canEdit={true}
          onUpdate={(updatedTour) => {
            // Update the tour state with the data from the database
            setTour(updatedTour);
            
            // If this was a new tour, it now has a real database ID
            if (isNewTour) {
              setIsNewTour(false);
            }
          }}
        />
      </motion.div>

      {/* Legacy cover preview (hidden, kept for reference) */}
      <div className="hidden">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg border-2 border-purple-200">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-purple-300 pb-4">
              <h3 className="text-2xl font-semibold text-purple-900">{tour.tourName}</h3>
              <p className="text-gray-600 mt-1">Tour File #{tour.id}</p>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Client Name</p>
                <p className="font-semibold">{tour.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agent</p>
                <p className="font-semibold">{tour.ManagerName}</p>
              </div>
            </div>

            {/* Tour Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total PAX</p>
                <p className="font-semibold">{tour.pax} Passengers</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PNR</p>
                <p className="font-semibold">{tour.pnr}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold">{new Date(tour.startDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold">{new Date(tour.endDate).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
              </div>
            </div>

            {/* Cities */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Cities to Visit</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(tour.cities) && tour.cities.length > 0 ? tour.cities.map(city => (
                  <Badge key={city} variant="secondary" className="bg-purple-100 text-purple-700">
                    {city}
                  </Badge>
                )) : <span className="text-gray-400 text-sm">No cities specified</span>}
              </div>
            </div>

            {/* Hotels */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Hotels</p>
              <ul className="space-y-1">
                {Array.isArray(tour.hotels) && tour.hotels.length > 0 ? tour.hotels.map(hotel => (
                  <li key={hotel} className="text-sm">• {hotel}</li>
                )) : <li className="text-sm text-gray-400">No hotels specified</li>}
              </ul>
            </div>

            {/* Guide & Transport */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Guide</p>
                <p className="font-semibold">{tour.guide}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transport</p>
                <p className="font-semibold">{tour.transportType}</p>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-center pt-4 border-t-2 border-purple-300">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-purple-900">₹{tour.revenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="conversations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="conversations">
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversations ({tour.conversations})
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Ticket className="w-4 h-4 mr-2" />
            Tickets ({tour.tickets})
          </TabsTrigger>
          <TabsTrigger value="hotels">
            <Hotel className="w-4 h-4 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="passengers">
            <Users className="w-4 h-4 mr-2" />
            Passengers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Conversation History</h3>
            <div className="space-y-3">
              {conversations.filter(c => c.tourId === tour.id).map(conv => (
                <div key={conv.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{conv.subject}</h4>
                    <span className="text-sm text-gray-500">{new Date(conv.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{conv.from}</p>
                  <p className="text-sm text-gray-500 mt-1">{conv.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Tickets & Bookings</h3>
            <div className="space-y-3">
              {tickets.filter(t => t.tourId === tour.id).map(ticket => (
                <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{ticket.type}</Badge>
                    {ticket.pnr && <span className="text-sm text-gray-600">PNR: {ticket.pnr}</span>}
                  </div>
                  {ticket.type === 'Flight' && (
                    <p className="text-sm">{ticket.from} → {ticket.to} on {new Date(ticket.date!).toLocaleDateString()}</p>
                  )}
                  {ticket.type === 'Hotel' && (
                    <p className="text-sm">{ticket.name} - Check in: {new Date(ticket.checkIn!).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hotels">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Hotel Bookings</h3>
            <div className="space-y-3">
              {Array.isArray(tour.hotels) && tour.hotels.length > 0 ? tour.hotels.map((hotel, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Hotel className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium">{hotel}</h4>
                      <p className="text-sm text-gray-600">Room Nights: {Math.round(tour.roomNights / tour.hotels.length)}</p>
                    </div>
                  </div>
                </div>
              )) : <p className="text-gray-400 text-sm">No hotel bookings yet</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passengers">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Passenger Details</h3>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Total Passengers</p>
                    <p className="text-2xl font-semibold text-purple-600 mt-1">{tour.pax}</p>
                  </div>
                  <Users className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center py-4">Detailed passenger list would be loaded here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
