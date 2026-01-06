import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plane, 
  Train, 
  Bus, 
  Hotel, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Mail,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const metrics = [
  { title: 'Total Bookings', value: '2,847', change: '+12.5%', icon: FileText, color: 'bg-blue-500' },
  { title: 'Tickets Processed', value: '8,234', change: '+8.2%', icon: CheckCircle, color: 'bg-green-500' },
  { title: 'Pending Reviews', value: '47', change: '-5.3%', icon: Clock, color: 'bg-yellow-500' },
  { title: 'Failed Parsing', value: '12', change: '-15.8%', icon: AlertCircle, color: 'bg-red-500' },
];

const ticketDistribution = [
  { name: 'Air', value: 4234, color: '#4A3CFF' },
  { name: 'Rail', value: 2345, color: '#2FB6E6' },
  { name: 'Bus', value: 876, color: '#1CC97A' },
  { name: 'Hotel', value: 779, color: '#FFB020' },
];

const weeklyData = [
  { day: 'Mon', tickets: 145, bookings: 45 },
  { day: 'Tue', tickets: 167, bookings: 52 },
  { day: 'Wed', tickets: 189, bookings: 61 },
  { day: 'Thu', tickets: 156, bookings: 48 },
  { day: 'Fri', tickets: 201, bookings: 67 },
  { day: 'Sat', tickets: 98, bookings: 32 },
  { day: 'Sun', tickets: 76, bookings: 25 },
];

const recentActivities = [
  { id: 1, type: 'email', subject: 'Flight booking confirmation - PNR ABC123', from: 'booking@airline.com', time: '5 mins ago', fileStatus: 'processed' },
  { id: 2, type: 'ticket', subject: 'Train ticket - IRCTC booking #7654321', from: 'noreply@irctc.co.in', time: '12 mins ago', fileStatus: 'processed' },
  { id: 3, type: 'email', subject: 'Hotel voucher - Taj Palace Delhi', from: 'reservations@tajhotels.com', time: '23 mins ago', fileStatus: 'review' },
  { id: 4, type: 'ticket', subject: 'Bus ticket - RedBus confirmation', from: 'support@redbus.in', time: '45 mins ago', fileStatus: 'processed' },
  { id: 5, type: 'email', subject: 'Amendment request - Flight PNR XYZ789', from: 'customer@example.com', time: '1 hour ago', fileStatus: 'pending' },
];

const upcomingTrips = [
  { id: 1, customer: 'Sharma Family', destination: 'Goa', date: 'Nov 20, 2024', type: 'leisure', fileCode: 'DL-RK-06-23-ST-0001' },
  { id: 2, customer: 'Rajesh Kumar', destination: 'Mumbai', date: 'Nov 21, 2024', type: 'business', fileCode: 'DL-MC-06-23-VH-0045' },
  { id: 3, customer: 'Priya Patel', destination: 'Jaipur', date: 'Nov 22, 2024', type: 'leisure', fileCode: 'BB-AB-06-23-DC-0112' },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change.startsWith('+');
          
          return (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{metric.title}</p>
                    <h3 className="text-3xl mt-2">{metric.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {metric.change}
                      </span>
                      <span className="text-gray-500 text-sm">vs last week</span>
                    </div>
                  </div>
                  <div className={`${metric.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tickets" fill="#4A3CFF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="bookings" fill="#2FB6E6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ticketDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {ticketDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Upcoming Trips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-lg ${activity.type === 'email' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    {activity.type === 'email' ? (
                      <Mail className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">From: {activity.from}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.fileStatus === 'processed' ? 'default' :
                    activity.fileStatus === 'review' ? 'secondary' : 
                    'outline'
                  }>
                    {activity.fileStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm">{trip.customer}</p>
                      <p className="text-xs text-gray-500 mt-1">File: {trip.fileCode}</p>
                    </div>
                    <Badge variant="outline">{trip.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Plane className="w-4 h-4" />
                    <span>{trip.destination}</span>
                    <span>•</span>
                    <span>{trip.date}</span>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-purple-600 hover:text-purple-700 text-sm py-2">
                View all upcoming trips →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
