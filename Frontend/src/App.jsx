import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './routes/LandingPage';
import LoginPage from './routes/LoginPage';
import Portal from './components/Portal';
import './App.css';

// Merged from src2
import DashboardLayout from './components/DashboardLayout';
import HotelsView from './components/HotelsView';
import RoomsView from './components/RoomsView';
import BookingsView from './components/BookingsView';
import UsersView from './components/UsersView';
import AdminHotelsView from './components/AdminHotelsView';

function ManagerConsole() {
  const [managerView, setManagerView] = useState('hotels'); 

  return (
    <DashboardLayout 
      title="Manager Dashboard"
      subtitle="Oversee your elegant hotels, manage pristine rooms, and track recent bookings seamlessly."
      roleBadge="Manager"
      navPills={[
        { id: 'hotels', label: 'My Hotels' },
        { id: 'rooms', label: 'Rooms' },
        { id: 'bookings', label: 'Bookings' }
      ]}
      currentView={managerView}
      setCurrentView={setManagerView}
    >
      {managerView === 'hotels' && <HotelsView />}
      {managerView === 'rooms' && <RoomsView />}
      {managerView === 'bookings' && <BookingsView isAdmin={false} />}
    </DashboardLayout>
  );
}

function AdminConsole() {
  const [adminView, setAdminView] = useState('hotels');

  return (
    <DashboardLayout 
      title="System Administrator"
      subtitle="Govern platform usage, authorize new properties, and resolve financial records."
      roleBadge="Admin"
      navPills={[
        { id: 'hotels', label: 'Authorization Queue' },
        { id: 'users', label: 'Users' },
        { id: 'bookings', label: 'Global Bookings' }
      ]}
      currentView={adminView}
      setCurrentView={setAdminView}
    >
      {adminView === 'hotels' && <AdminHotelsView />}
      {adminView === 'users' && <UsersView />}
      {adminView === 'bookings' && <BookingsView isAdmin={true} />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/manager/*" element={<ManagerConsole />} />
      <Route path="/admin/*" element={<AdminConsole />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

