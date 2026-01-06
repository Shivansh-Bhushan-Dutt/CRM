import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { TourFilesList } from './components/TourFilesList';
import { TourFileDetail } from './components/TourFileDetail';
import { EmailConversations } from './components/EmailConversations';
import { BookingsPage } from './components/BookingsPage';
import { BookingDetail } from './components/BookingDetail';
import { TicketDetail } from './components/TicketDetail';
import { ConversationCenter } from './components/ConversationCenter';
import { SettingsPage } from './components/SettingsPage';
import { LoginScreen } from './components/LoginScreen';

export type UserRole = 'admin' | 'manager';

export interface User {
  id?: string;
  name: string;
  role: UserRole;
  isAdmin: boolean;
  email?: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({
    name: 'Madhu Chaudhary',
    role: 'admin',
    isAdmin: true
  });

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(user) => {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'tour-files':
        return <TourFilesList onSelectTour={(id) => {
          setSelectedTourId(id);
          setCurrentPage('tour-detail');
        }} currentUser={currentUser} />;
      case 'tour-detail':
        if (!selectedTourId) {
          setCurrentPage('tour-files');
          return <TourFilesList onSelectTour={(id) => {
            setSelectedTourId(id);
            setCurrentPage('tour-detail');
          }} currentUser={currentUser} />;
        }
        return <TourFileDetail tourId={selectedTourId} onBack={() => {
          setSelectedTourId(null);
          setCurrentPage('tour-files');
        }} currentUser={currentUser} />;
      case 'emails':
        return <EmailConversations />;
      case 'bookings':
        return <BookingsPage onSelectBooking={(id) => {
          setSelectedBookingId(id);
          setCurrentPage('booking-detail');
        }} />;
      case 'booking-detail':
        return <BookingDetail bookingId={selectedBookingId} onBack={() => setCurrentPage('bookings')} />;
      case 'ticket-detail':
        return <TicketDetail ticketId={selectedTicketId} onBack={() => setCurrentPage('bookings')} />;
      case 'conversations':
        return <ConversationCenter />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    setSelectedTourId(null);
    setSelectedBookingId(null);
    setSelectedTicketId(null);
    setCurrentUser({
      name: 'Madhu Chaudhary',
      role: 'admin',
      isAdmin: true
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentUser={currentUser} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}