import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { importAPI } from '../services/api';

interface Guide {
  id: string;
  name: string;
  phone?: string;
  expertise: string[];
  rating?: number;
}

export function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      setLoading(true);
      try {
        const data = await importAPI.getGuides();
        // Parse expertise if it's a string
        const parsedGuides = data.map((guide: any) => ({
          ...guide,
          expertise: typeof guide.expertise === 'string' ? guide.expertise.split(',').map((s: string) => s.trim()) : guide.expertise || [],
        }));
        setGuides(parsedGuides);
      } catch (error) {
        console.error('Error fetching guides:', error);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const filteredGuides = guides.filter(guide => 
    guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Tour Guides</h1>
        <p className="text-gray-600 mt-1">{filteredGuides.length} guides available</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search guides by name or expertise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No guides found</p>
          <p className="text-sm mt-2">Upload guides via Settings → Excel Import</p>
        </div>
      ) : (
      <>
      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide, idx) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
          >
            {/* Guide Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{guide.name}</h3>
                <div className="flex items-center gap-2">
                  {guide.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{guide.rating}</span>
                  </div>
                  )}
                  {guide.phone && <span className="text-sm text-gray-500">• {guide.phone}</span>}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Phone className="w-4 h-4" />
              <span>{guide.phone}</span>
            </div>

            {/* Expertise */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Expertise:</p>
              <div className="flex flex-wrap gap-2">
                {guide.expertise.map(exp => (
                  <Badge key={exp} variant="secondary" className="bg-purple-100 text-purple-700">
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
