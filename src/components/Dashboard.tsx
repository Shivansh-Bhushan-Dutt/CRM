import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, FileText, Hotel, Calendar, X } from 'lucide-react';
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
  id: string;
  tourName: string;
  clientName: string;
  clientCountry: string;
  pax: number;
  cities: string[];
  hotels: string[];
  guide: string;
  transportType: string;
  startDate: string;
  endDate: string;
  status: string;
  invoiceStatus?: string;
  foreignTourOperator?: string;
  revenue: number;
  roomNights: number;
  manager: {
    id: string;
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
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [showPaxModal, setShowPaxModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
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
  }, [selectedYear, selectedMonth]);

  // Filter tour files based on selections and user role
  const filteredTours = useMemo(() => {
    if (!stats?.tourFiles) return [];
    
    return stats.tourFiles.filter(tour => {
      // Role-based filter: managers only see their own tours
      if (user && !user.isAdmin) {
        if (!tour.manager?.name || tour.manager.name !== user.name) return false;
      }
      
      // Agent filter
      if (selectedAgent !== 'all' && (!tour.manager?.name || tour.manager.name !== selectedAgent)) return false;
      
      // Foreign Tour Operator filter
      if (selectedOperator !== 'all' && (!tour.foreignTourOperator || tour.foreignTourOperator !== selectedOperator)) return false;
      
      return true;
    });
  }, [stats, selectedAgent, selectedOperator, user]);

  // Calculate KPIs
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
    const completedTours = filteredTours.filter(t => {
      const status = t.status?.toUpperCase();
      return status === 'COMPLETED';
    }).length;
    const inProgressTours = filteredTours.filter(t => {
      const status = t.status?.toUpperCase();
      return status === 'IN-PROGRESS' || status === 'IN_PROGRESS' || status === 'INPROGRESS';
    }).length;
    const upcomingTours = filteredTours.filter(t => {
      const status = t.status?.toUpperCase();
      return status === 'UPCOMING';
    }).length;

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

  // Invoice statistics
  const invoiceStats = useMemo(() => {
    const paid = filteredTours.filter(t => t.invoiceStatus?.toUpperCase() === 'PAID').length;
    const pending = filteredTours.filter(t => t.invoiceStatus?.toUpperCase() === 'PENDING').length;
    const yetToRaise = filteredTours.filter(t => !t.invoiceStatus || t.invoiceStatus.toUpperCase() === 'YET_TO_RAISE').length;

    return {
      paid,
      pending,
      yetToRaise,
      total: filteredTours.length,
      chartData: [
        { name: 'Paid', value: paid, color: '#10b981' },
        { name: 'Pending', value: pending, color: '#f59e0b' },
        { name: 'Yet to Raise', value: yetToRaise, color: '#6366f1' }
      ]
    };
  }, [filteredTours]);

  // Guide statistics
  const guideStats = useMemo(() => {
    const stats = new Map<string, { name: string; tours: number; pax: number }>();
    
    filteredTours.forEach(tour => {
      if (!stats.has(tour.guide)) {
        stats.set(tour.guide, { name: tour.guide, tours: 0, pax: 0 });
      }
      const stat = stats.get(tour.guide)!;
      stat.tours += 1;
      stat.pax += tour.pax;
    });

    return Array.from(stats.values()).sort((a, b) => b.pax - a.pax).slice(0, 6);
  }, [filteredTours]);

  // Hotel statistics
  const hotelStats = useMemo(() => {
    const stats = new Map<string, { name: string; bookings: number; roomNights: number; revenue: number; city: string }>();
    
    filteredTours.forEach(tour => {
      tour.hotels.forEach(hotelName => {
        if (!stats.has(hotelName)) {
          stats.set(hotelName, { 
            name: hotelName, 
            bookings: 0, 
            roomNights: 0, 
            revenue: 0,
            city: 'Unknown'
          });
        }
        const stat = stats.get(hotelName)!;
        stat.bookings += 1;
        stat.roomNights += Math.floor(tour.roomNights / tour.hotels.length); // Distribute room nights
        stat.revenue += tour.revenue / tour.hotels.length; // Distribute revenue
      });
    });

    return Array.from(stats.values()).sort((a, b) => b.bookings - a.bookings).slice(0, 6);
  }, [filteredTours]);

  // Transport statistics
  const transportStats = useMemo(() => {
    const stats = new Map<string, number>();
    
    filteredTours.forEach(tour => {
      stats.set(tour.transportType, (stats.get(tour.transportType) || 0) + 1);
    });

    return Array.from(stats.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTours]);

  // PAX handling by agent
  const agentPaxStats = useMemo(() => {
    const stats = new Map<string, number>();
    
    filteredTours.forEach(tour => {
      const agentName = tour.manager.name;
      stats.set(agentName, (stats.get(agentName) || 0) + tour.pax);
    });

    return Array.from(stats.entries())
      .map(([name, pax]) => ({ name, pax }))
      .sort((a, b) => b.pax - a.pax);
  }, [filteredTours]);

  // Get unique agents/foreign tour operators
  const agents = useMemo(() => {
    if (!stats?.tourFiles) return [];
    const uniqueAgents = new Set(stats.tourFiles.map(t => t.manager.name));
    return Array.from(uniqueAgents).sort();
  }, [stats]);

  const foreignOperators = useMemo(() => {
    if (!stats?.tourFiles) return [];
    const uniqueOperators = new Set<string>();
    stats.tourFiles.forEach(t => {
      if (t.foreignTourOperator) uniqueOperators.add(t.foreignTourOperator);
    });
    return Array.from(uniqueOperators).sort();
  }, [stats]);

  // Revenue by Foreign Tour Operator
  const operatorRevenueStats = useMemo(() => {
    const stats = new Map<string, { revenue: number; roomNights: number; bookings: number }>();
    
    filteredTours.forEach(tour => {
      const operator = tour.foreignTourOperator || 'Unknown';
      if (!stats.has(operator)) {
        stats.set(operator, { revenue: 0, roomNights: 0, bookings: 0 });
      }
      const stat = stats.get(operator)!;
      stat.bookings += 1;
      stat.revenue += tour.revenue;
      stat.roomNights += tour.roomNights;
    });

    return Array.from(stats.entries())
      .map(([operator, data]) => ({ operator, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredTours]);

  // Country distribution for PAX
  const countryPaxStats = useMemo(() => {
    const stats = new Map<string, number>();
    
    filteredTours.forEach(tour => {
      stats.set(tour.clientCountry, (stats.get(tour.clientCountry) || 0) + tour.pax);
    });

    return Array.from(stats.entries())
      .map(([country, pax]) => ({ country, pax }))
      .sort((a, b) => b.pax - a.pax);
  }, [filteredTours]);

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


      {/* Filters Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.slice(1).map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.slice(1).map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">File Handling Manager</label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Managers</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Foreign Tour Operator</label>
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operators</SelectItem>
                {foreignOperators.map(operator => (
                  <SelectItem key={operator} value={operator}>{operator}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => setShowPaxModal(true)} className="cursor-pointer">
          <KPICard 
            title="Total PAX" 
            value={kpis.totalPax} 
            icon={Users} 
            color="bg-purple-500"
            delay={0.1}
            clickable={true}
          />
        </div>
        <div onClick={() => setShowRevenueModal(true)} className="cursor-pointer">
          <KPICard 
            title="Revenue" 
            value={`₹${(kpis.totalRevenue / 100000).toFixed(1)}L`} 
            icon={DollarSign} 
            color="bg-blue-500"
            delay={0.2}
            clickable={true}
          />
        </div>
        <div onClick={() => setShowInvoiceModal(true)} className="cursor-pointer">
          <KPICard 
            title="Total Files" 
            value={kpis.totalFiles} 
            icon={FileText} 
            color="bg-indigo-500"
            delay={0.3}
            clickable={true}
          />
        </div>
        <KPICard 
          title="Room Nights" 
          value={kpis.totalRoomNights} 
          icon={Hotel} 
          color="bg-cyan-500"
          delay={0.4}
        />
      </div>

      {/* PAX by Country Modal */}
      <AnimatePresence>
        {showPaxModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowPaxModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">PAX Distribution by Country</h2>
                  <p className="text-sm text-gray-600 mt-1">Total: {kpis.totalPax} passengers</p>
                </div>
                <button
                  onClick={() => setShowPaxModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">Distribution Chart</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={countryPaxStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ country, pax, percent }) => `${country}: ${pax}`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="pax"
                        >
                          {countryPaxStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">PAX by Country</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={countryPaxStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="pax" fill="#8b5cf6" name="PAX" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Country List */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countryPaxStats.map((stat, idx) => (
                      <motion.div
                        key={stat.country}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Country</p>
                            <p className="font-semibold text-lg">{stat.country}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">PAX</p>
                            <p className="font-semibold text-2xl text-purple-600">{stat.pax}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stat.pax / kpis.totalPax) * 100}%` }}
                              transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {((stat.pax / kpis.totalPax) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revenue by Foreign Tour Operator Modal */}
      <AnimatePresence>
        {showRevenueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowRevenueModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Revenue Distribution by Foreign Tour Operator</h2>
                  <p className="text-sm text-gray-600 mt-1">Total: ₹{(kpis.totalRevenue / 100000).toFixed(1)}L</p>
                </div>
                <button
                  onClick={() => setShowRevenueModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">Distribution Chart</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={operatorRevenueStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ operator, revenue, percent }) => `${operator}: ₹${(revenue / 1000).toFixed(0)}K`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {operatorRevenueStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">Revenue by Operator</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={operatorRevenueStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="operator" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `₹${(value / 1000).toFixed(0)}K`} />
                        <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Operator List */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {operatorRevenueStats.map((stat, idx) => (
                      <motion.div
                        key={stat.operator}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Operator</p>
                            <p className="font-semibold text-lg">{stat.operator}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="font-semibold text-2xl text-purple-600">₹{(stat.revenue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stat.revenue / kpis.totalRevenue) * 100}%` }}
                              transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {((stat.revenue / kpis.totalRevenue) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Status Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowInvoiceModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Invoice Status</h2>
                  <p className="text-sm text-gray-600 mt-1">Total Invoices: {invoiceStats.total}</p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">Invoice Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={invoiceStats.chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {invoiceStats.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bar Chart */}
                  <div>
                    <h3 className="font-semibold mb-4">Invoice Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={invoiceStats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Count">
                          {invoiceStats.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Invoice Stats Cards */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-green-600">{invoiceStats.paid}</span>
                      </div>
                      <h4 className="font-semibold text-lg text-green-900">Paid</h4>
                      <p className="text-sm text-green-600 mt-1">
                        {invoiceStats.total > 0 ? ((invoiceStats.paid / invoiceStats.total) * 100).toFixed(1) : 0}% of total
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-orange-600">{invoiceStats.pending}</span>
                      </div>
                      <h4 className="font-semibold text-lg text-orange-900">Pending</h4>
                      <p className="text-sm text-orange-600 mt-1">
                        {invoiceStats.total > 0 ? ((invoiceStats.pending / invoiceStats.total) * 100).toFixed(1) : 0}% of total
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-indigo-600">{invoiceStats.yetToRaise}</span>
                      </div>
                      <h4 className="font-semibold text-lg text-indigo-900">Yet to Raise</h4>
                      <p className="text-sm text-indigo-600 mt-1">
                        {invoiceStats.total > 0 ? ((invoiceStats.yetToRaise / invoiceStats.total) * 100).toFixed(1) : 0}% of total
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="agents">Managers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tour Completion Summary */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold mb-4">Tour Completion Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: kpis.completedTours },
                      { name: 'In Progress', value: kpis.inProgressTours },
                      { name: 'Upcoming', value: kpis.upcomingTours }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#6366f1" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Agent PAX Comparison */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold mb-4">PAX Handling Comparison</h3>
              <div className="space-y-3">
                {agentPaxStats.slice(0, 6).map((agent, idx) => (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{agent.name}</span>
                        <span className="text-sm text-gray-600">{agent.pax} PAX</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(agent.pax / agentPaxStats[0].pax) * 100}%` }}
                          transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Operator Revenue Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="font-semibold mb-4">Revenue by Foreign Tour Operator</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={operatorRevenueStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="operator" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${(value / 1000).toFixed(0)}K`} />
                <Legend />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold mb-4">Guide Distribution by PAX</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={guideStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, pax }) => `${name}: ${pax}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="pax"
                  >
                    {guideStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Vertical Bar Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold mb-4">Guides Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={guideStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pax" fill="#8b5cf6" name="PAX Escorted" />
                  <Bar dataKey="tours" fill="#6366f1" name="Total Tours" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guideStats.map((guide, idx) => (
              <motion.div
                key={guide.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{guide.name}</h4>
                    <p className="text-sm text-gray-500">{guide.tours} tours</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PAX Escorted:</span>
                    <span className="font-semibold">{guide.pax}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Hotels Tab */}
        <TabsContent value="hotels" className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="font-semibold mb-4">Top Hotels by Bookings</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={hotelStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#6366f1" name="Bookings" />
                <Bar dataKey="roomNights" fill="#8b5cf6" name="Room Nights" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelStats.map((hotel, idx) => (
              <motion.div
                key={hotel.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{hotel.name}</h4>
                    <p className="text-sm text-gray-500">{hotel.city}</p>
                  </div>
                  <Hotel className="w-5 h-5 text-purple-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Bookings</p>
                    <p className="font-semibold">{hotel.bookings}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nights</p>
                    <p className="font-semibold">{Math.round(hotel.roomNights)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold">₹{(hotel.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold mb-4">Transport Usage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transportStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
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

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-semibold mb-4">Transport Type Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transportStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" name="Tours" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h3 className="font-semibold mb-4">Manager's Performance - PAX Handled</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={agentPaxStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pax" fill="#8b5cf6" name="Total PAX" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  clickable?: boolean;
}

function KPICard({ title, value, icon: Icon, color, delay, clickable = false }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
