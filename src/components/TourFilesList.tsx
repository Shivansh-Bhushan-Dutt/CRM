import { useState, useMemo, useEffect } from 'react';
import { Search, Grid, List, MapPin, Users, Calendar, Car, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { tourFileAPI } from '../services/api';

interface TourFile {
  id: string;
  fileCode: string;
  tourName: string;
  clientCountry: string;
  pax: number;
  startDate: string;
  endDate: string;
  status: string;
  revenue: number;
  cities: string[];
  foreignTourOperator?: string;
  manager?: {
    name: string;
  };
}

interface TourFilesListProps {
  onSelectTour: (tourId: string) => void;
  currentUser: User;
}

export function TourFilesList({ onSelectTour, currentUser }: TourFilesListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [tourFiles, setTourFiles] = useState<TourFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load tour files from PostgreSQL database (API)
  useEffect(() => {
    const loadTours = async () => {
      try {
        console.log('📥 Loading tour files from database...');
        setLoading(true);
        const response = await tourFileAPI.getAll();
        console.log('📥 Tour files response:', response);
        
        if (response.success && response.data) {
          console.log('✅ Tour files received:', response.data.length, 'tours');
          console.log('✅ First tour sample:', response.data[0]);
          console.log('✅ Tour IDs:', response.data.map((t: any) => ({ id: t.id, name: t.tourName })));
          
          // Parse JSON strings to arrays with proper error handling
          const parsedTours = response.data.map((tour: any) => {
            const parseCities = () => {
              if (!tour.cities) return [];
              if (Array.isArray(tour.cities)) return tour.cities;
              try {
                const parsed = JSON.parse(tour.cities);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            };

            const parseHotels = () => {
              if (!tour.hotels) return [];
              if (Array.isArray(tour.hotels)) return tour.hotels;
              try {
                const parsed = JSON.parse(tour.hotels);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            };

            const parseGuides = () => {
              if (!tour.guides) return [];
              if (Array.isArray(tour.guides)) return tour.guides;
              try {
                const parsed = JSON.parse(tour.guides);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            };

            return {
              ...tour,
              cities: parseCities(),
              hotels: parseHotels(),
              guides: parseGuides(),
            };
          });
          console.log('✅ Parsed tours:', parsedTours.length, 'tours');
          setTourFiles(parsedTours);
        } else {
          console.log('⚠️ No tours found in response');
          setTourFiles([]);
        }
      } catch (error) {
        console.error('❌ Error loading tour files:', error);
        setTourFiles([]);
      } finally {
        setLoading(false);
      }
    };
    loadTours();
    
    // Listen for tour save events
    const handleTourSaved = () => {
      console.log('🔄 Tour saved event received, reloading tours...');
      loadTours();
    };
    window.addEventListener('tourFilesSaved', handleTourSaved);
    
    return () => {
      window.removeEventListener('tourFilesSaved', handleTourSaved);
    };
  }, [refreshTrigger]);

  // Filter tours based on user role
  const visibleTours = useMemo(() => {
    let tours = tourFiles;
    
    // If user is manager (not admin), only show their tours
    if (!currentUser.isAdmin && tours.length > 0) {
      tours = tours.filter(tour => tour.manager?.name === currentUser.name);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tours = tours.filter(tour => 
        tour.tourName?.toLowerCase().includes(query) ||
        tour.fileCode?.toLowerCase().includes(query) ||
        tour.clientCountry?.toLowerCase().includes(query) ||
        tour.foreignTourOperator?.toLowerCase().includes(query) ||
        (tour.cities && tour.cities.some(city => city.toLowerCase().includes(query)))
      );
    }
    
    return tours;
  }, [tourFiles, currentUser, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleDeleteTour = async (e: React.MouseEvent, tourId: string, tourName: string) => {
    e.stopPropagation(); // Prevent tour card click
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${tourName}"?\n\nThis will permanently remove this tour file from the database.`
    );
    
    if (!confirmDelete) return;
    
    try {
      console.log('🗑️ Deleting tour file:', tourId);
      const response = await tourFileAPI.delete(tourId);
      
      if (response.success) {
        alert('✅ Tour file deleted successfully!');
        // Trigger refresh
        setRefreshTrigger(prev => prev + 1);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tour Files</h1>
          <p className="text-gray-600 mt-1">{visibleTours.length} tours found</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTour('new')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-650 hover:to-blue-600 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Tour File
          </button>
          <div className="w-px h-8 bg-gray-300"></div>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by tour name, file code, country, or operator..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {visibleTours.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No tour files created yet</p>
          <p className="text-sm mt-2">Click "Add New Tour File" to create your first tour</p>
        </div>
      ) : (
        <>
      {/* Tours Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTours.map((tour, idx) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-500 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <h3 className="font-semibold text-lg mb-2">{tour.tourName}</h3>
                    <p className="text-sm opacity-90">{tour.clientCountry}</p>
                  </div>
                </div>
                <Badge className={`absolute top-3 right-3 ${getStatusColor(tour.status)} border`}>
                  {tour.status}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3 cursor-pointer" onClick={() => {
                console.log('🖱️ Clicked tour card:', tour.id, tour.tourName);
                onSelectTour(tour.id);
              }}>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{tour.pax} PAX</span>
                  <span className="mx-2">•</span>
                  <span>{tour.clientCountry}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{tour.cities.join(', ')}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car className="w-4 h-4" />
                  <span>{tour.foreignTourOperator || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{tour.fileCode}</span>
                  <span className="text-sm font-semibold text-purple-600">₹{(tour.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>

              {/* Delete Button - Only for Admin */}
              {currentUser.isAdmin && (
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    onClick={(e) => handleDeleteTour(e, tour.id, tour.tourName)}
                    variant="outline"
                    size="sm"
                    className="bg-white/90 backdrop-blur-sm border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAX</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                {currentUser.isAdmin && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visibleTours.map((tour) => (
                <motion.tr
                  key={tour.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => onSelectTour(tour.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{tour.tourName}</div>
                      <div className="text-sm text-gray-500">{tour.fileCode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.clientCountry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.pax}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{tour.cities.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(tour.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getStatusColor(tour.status)} border`}>
                      {tour.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-purple-600">₹{(tour.revenue / 1000).toFixed(0)}K</div>
                  </td>
                  {currentUser.isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={(e) => handleDeleteTour(e, tour.id, tour.tourName)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </>
      )}
    </div>
  );
}
