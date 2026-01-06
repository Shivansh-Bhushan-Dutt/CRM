import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  FileText,
  Tag,
  Plus,
  Edit,
  Star,
  Plane,
  Hotel
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const customer = {
  id: 'CUST-1234',
  name: 'Mr. Rajesh Kumar',
  email: 'rajesh.kumar@email.com',
  phone: '+91 98765 43210',
  alternatePhone: '+91 98765 43211',
  address: 'A-123, Sector 15, Noida, Uttar Pradesh, India - 201301',
  dateOfBirth: 'March 15, 1985',
  joinedDate: 'Jan 10, 2020',
  totalBookings: 24,
  totalSpent: '₹4,75,000',
  tags: ['VIP', 'Corporate', 'Frequent Traveler'],
  preferences: {
    seatPreference: 'Window Seat',
    mealPreference: 'Vegetarian',
    specialRequests: 'Requires wheelchair assistance'
  }
};

const bookingHistory = [
  {
    id: 'BK2847',
    fileCode: 'DL-RK-06-23-ST-0001',
    destination: 'Bangalore',
    date: 'Nov 28, 2024',
    fileStatus: 'confirmed',
    amount: '₹45,850',
    type: 'Business Trip'
  },
  {
    id: 'BK2645',
    fileCode: 'DL-RK-05-23-ST-0089',
    destination: 'Goa',
    date: 'Oct 15, 2024',
    fileStatus: 'completed',
    amount: '₹68,500',
    type: 'Leisure'
  },
  {
    id: 'BK2401',
    fileCode: 'DL-MC-04-23-VH-0234',
    destination: 'Kerala',
    date: 'Sep 5, 2024',
    fileStatus: 'completed',
    amount: '₹95,200',
    type: 'Family Vacation'
  },
  {
    id: 'BK2198',
    fileCode: 'DL-RK-03-23-DC-0156',
    destination: 'Rajasthan',
    date: 'Jul 20, 2024',
    fileStatus: 'completed',
    amount: '₹1,25,000',
    type: 'Cultural Tour'
  }
];

const notes = [
  {
    id: 1,
    author: 'Raghwendra Kumar',
    date: 'Nov 10, 2024',
    content: 'Customer prefers early morning flights. Always book departures before 10 AM.'
  },
  {
    id: 2,
    author: 'Madhu Chaudhary',
    date: 'Oct 5, 2024',
    content: 'VIP customer. Requires premium service and personalized attention.'
  },
  {
    id: 3,
    author: 'Raghwendra Kumar',
    date: 'Sep 1, 2024',
    content: 'Customer has mobility issues. Always arrange wheelchair assistance at airports.'
  }
];

export function CustomerProfile() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Customer Profile</h1>
          <p className="text-gray-600">Complete customer information and history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-600 to-blue-500 text-white">
                RK
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl">{customer.name}</h2>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {customer.tags.map((tag) => (
                  <Badge key={tag} className="bg-purple-600 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>DOB: {customer.dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Customer since {customer.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl">{customer.totalBookings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl text-purple-600">{customer.totalSpent}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Primary Email</p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{customer.email}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Primary Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{customer.phone}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Alternate Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{customer.alternatePhone}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-sm">{customer.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Preferences & Special Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Seat Preference</p>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm">{customer.preferences.seatPreference}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Meal Preference</p>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm">{customer.preferences.mealPreference}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Special Requests</p>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm">{customer.preferences.specialRequests}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Manage Tags
              </Button>
              <Button variant="outline" size="sm" className="ml-2">
                <Edit className="w-4 h-4 mr-2" />
                Update Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking History & Notes */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">Booking History ({bookingHistory.length})</TabsTrigger>
              <TabsTrigger value="notes">Notes & Comments ({notes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4 mt-6">
              <div className="space-y-3">
                {bookingHistory.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                            {booking.type.includes('Business') ? (
                              <Plane className="w-6 h-6" />
                            ) : (
                              <Hotel className="w-6 h-6" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3>{booking.destination}</h3>
                              <Badge variant={booking.fileStatus === 'confirmed' ? 'default' : 'secondary'}>
                                {booking.fileStatus}
                              </Badge>
                              <Badge variant="outline">{booking.type}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Booking ID: {booking.id}</span>
                              <span>•</span>
                              <span>File: {booking.fileCode}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{booking.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl text-purple-600">{booking.amount}</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="ml-4">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 mt-6">
              <div className="flex justify-end mb-4">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>

              <div className="space-y-3">
                {notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{note.author}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{note.date}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
