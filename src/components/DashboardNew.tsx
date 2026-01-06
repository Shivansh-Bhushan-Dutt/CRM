import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Users, DollarSign, FileText, Hotel, Calendar, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { dashboardAPI } from '../services/api';

const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

interface User {
  name: string;
  role: string;
  email?: string;
  isAdmin?: boolean;
}

interface DashboardProps {
  user?: User;
}

interface TourFile {
  id: number;
  fileCode: string;
  tourName: string;
  clientName: string;
  clientCountry: string;
  pax: number;
  startDate: string;
  endDate: string;
  status: string;
  pnr: string;
  revenue: number;
  roomNights: number;
  managerId: number;
  year: number;
  month: number;
  cities: string[];
  hotels: string[];
  guide: string;
  transportType: string;
  manager: {
    id: number;
    name: string;
    email: string;
  };
}

interface DashboardStats {
  kpis: {
    totalPax: number;
    totalRevenue: number;
    totalRoomNights: number;
    totalFiles: number;
  };
  guideStats: Array<{ name: string; files: number; pax: number; revenue: number }>;
  hotelStats: Array<{ name: string; bookings: number; roomNights: number }>;
  tourFiles: TourFile[];
}

export function Dashboard({ user }: DashboardProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const years = ['all', (currentYear - 1).toString(), currentYear.toString(), (currentYear + 1).toString()];
  const months = ['all', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await dashboardAPI.getStats({
          year: selectedYear,
          month: selectedMonth,
          managerId: selectedAgent !== 'all' ? selectedAgent : undefined
        });
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear, selectedMonth, selectedAgent]);

  // Filter tours based on user role
  const filteredTours = useMemo(() => {
    if (!stats?.tourFiles) return [];
    
    return stats.tourFiles.filter(tour => {
      // Role-based filter: managers only see their own tours
      if (user && !user.isAdmin) {
        if (tour.manager.name !== user.name) return false;
      }
      
      // Agent filter
      if (selectedAgent !== 'all' && tour.manager.name !== selectedAgent) return false;
      
      return true;
    });
  }, [stats, selectedAgent, user]);

  // Recalculate KPIs based on filtered tours
  const kpis = useMemo(() => {
    if (!filteredTours.length) {
      return {
        totalPax: 0,
        totalRevenue: 0,
        totalFiles: 0,
        totalRoomNights: 0,
        completedTours: 0,
        inProgressTours: 0,
        upcomingTours: 0
      };
    }

    const totalPax = filteredTours.reduce((sum, tour) => sum + tour.pax, 0);
    const totalRevenue = filteredTours.reduce((sum, tour) => sum + tour.revenue, 0);
    const totalFiles = filteredTours.length;
    const totalRoomNights = filteredTours.reduce((sum, tour) => sum + tour.roomNights, 0);
    const completedTours = filteredTours.filter(t => t.status === 'completed').length;
    const inProgressTours = filteredTours.filter(t => t.status === 'in-progress').length;
    const upcomingTours = filteredTours.filter(t => t.status === 'upcoming').length;

    return {
      totalPax,
      totalRevenue,
      totalFiles,
      totalRoomNights,
      completedTours,
      inProgressTours,
      upcomingTours
    };
  }, [filteredTours]);

  // Transport statistics
  const transportStats = useMemo(() => {
    const stats = new Map<string, number>();
    
    filteredTours.forEach(tour => {
      stats.set(tour.transportType, (stats.get(tour.transportType) || 0) + 1);
    });

    return Array.from(stats.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredTours]);

  // Agent PAX statistics
  const agentPaxStats = useMemo(() => {
    const agentStats = new Map<string, number>();
    
    filteredTours.forEach(tour => {
      agentStats.set(tour.manager.name, (agentStats.get(tour.manager.name) || 0) + tour.pax);
    });

    return Array.from(agentStats.entries())
      .map(([name, pax]) => ({ name, pax }))
      .sort((a, b) => b.pax - a.pax);
  }, [filteredTours]);

  // City revenue statistics
  const cityRevenueStats = useMemo(() => {
    const cityStats = new Map<string, { revenue: number; roomNights: number; bookings: number }>();
    
    filteredTours.forEach(tour => {
      tour.cities.forEach(city => {
        if (!cityStats.has(city)) {
          cityStats.set(city, { revenue: 0, roomNights: 0, bookings: 0 });
        }
        const stat = cityStats.get(city)!;
        stat.bookings += 1;
        stat.revenue += tour.revenue / tour.cities.length;
        stat.roomNights += tour.roomNights / tour.cities.length;
      });
    });

    return Array.from(cityStats.entries())
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredTours]);

  // Country PAX statistics
  const countryPaxStats = useMemo(() => {
    const countryStats = new Map<string, number>();
    
    filteredTours.forEach(tour => {
      countryStats.set(tour.clientCountry, (countryStats.get(tour.clientCountry) || 0) + tour.pax);
    });

    return Array.from(countryStats.entries())
      .map(([country, pax]) => ({ country, pax }))
      .sort((a, b) => b.pax - a.pax);
  }, [filteredTours]);

  // Get unique agents
  const agents = useMemo(() => {
    if (!stats?.tourFiles) return [];
    const uniqueAgents = new Set(stats.tourFiles.map(t => t.manager.name));
    return Array.from(uniqueAgents).sort();
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time analytics and insights</p>
        </div>
      </div>

      {/* Filters Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === 'all' ? 'All Years' : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {month === 'all' ? 'All Months' : month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {user?.isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map(agent => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-lg shadow-lg text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Total PAX</p>
              <p className="text-3xl font-bold mt-2">{kpis.totalPax.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 text-violet-200" />
          </div>
          <p className="text-violet-100 text-xs mt-4">
            {kpis.upcomingTours} upcoming • {kpis.inProgressTours} in-progress
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">₹{(kpis.totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
          <p className="text-blue-100 text-xs mt-4">
            ₹{Math.round(kpis.totalRevenue / kpis.totalFiles || 0).toLocaleString()} avg per file
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-lg shadow-lg text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Tour Files</p>
              <p className="text-3xl font-bold mt-2">{kpis.totalFiles}</p>
            </div>
            <FileText className="w-12 h-12 text-emerald-200" />
          </div>
          <p className="text-emerald-100 text-xs mt-4">
            {kpis.completedTours} completed tours
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Room Nights</p>
              <p className="text-3xl font-bold mt-2">{kpis.totalRoomNights}</p>
            </div>
            <Hotel className="w-12 h-12 text-orange-200" />
          </div>
          <p className="text-orange-100 text-xs mt-4">
            {Math.round(kpis.totalRoomNights / kpis.totalFiles || 0)} avg per tour
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guide Performance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Guides by Tours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.guideStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="files" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hotel Performance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Hotels by Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.hotelStats || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Transport Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transport Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transportStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {transportStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Agent PAX Handling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PAX by Agent</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentPaxStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pax" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Tours Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tour Files</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAX</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTours.slice(0, 10).map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tour.fileCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.tourName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.pax}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{tour.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tour.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tour.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tour.manager.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
