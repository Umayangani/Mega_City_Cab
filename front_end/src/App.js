import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Home Page Components
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './Home/Login';
import NavBar from './Home/NavBar';

// Admin Dashboard Components
import AdminDashboard from './adminDashboard/Dashboard';
import AdminSidebar from './adminDashboard/Sidebar';
import AdminLayout from './adminDashboard/AdminLayout';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import VehicleList from './pages/VehicleList';
import ViewVehicles from './pages/ViewVehicles';

// Customer Dashboard Components
import CustomerNavbar from './customerDashboard/Navigationbar';
import CustomerBody from './customerDashboard/Body';
import CustomerFooter from './customerDashboard/Footer';
import BookingPage from './customerDashboard/BookingPage';
import CustomerBookings from './customerDashboard/CustomerBookings';
import TrackRide from './customerDashboard/TrackRide';

// Driver Dashboard Components
import DriverDashboard from './driverDashboard/DriverDashboard';
import DriverFooter from './driverDashboard/DriverFooter';
import DriverHeader from './driverDashboard/DriverHeader';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const loggedInUserString = localStorage.getItem('user');
      
      if (loggedInUserString &&
          loggedInUserString !== "undefined" &&
          loggedInUserString !== "null" &&
          loggedInUserString.trim() !== "") {
        try {
          const foundUser = JSON.parse(loggedInUserString);
          if (foundUser && typeof foundUser === 'object' && foundUser.role) {
            setUser(foundUser);
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } catch (parseError) {
          console.error('Invalid JSON in localStorage:', parseError);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const isAdmin = user && user.role === 'admin';
  const isDriver = user && user.role === 'driver';
  const isCustomer = user && user.role === 'customer';
  const isAuthenticated = !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <NavBar />
            <Home />
          </>
        } />
        
        {/* Login Route */}
        <Route path="/login" element={
          localStorage.getItem('user') &&
          JSON.parse(localStorage.getItem('user'))?.role ? (
            <Navigate to={
              isAdmin ? "/admin/dashboard" :
              isDriver ? "/driver/dashboard" :
              "/customer/dashboard"
            } />
          ) : (
            <>
              <NavBar />
              <Login setUser={setUser} />
            </>
          )
        } />
        
        <Route path="/register" element={
          isAuthenticated ?
            <Navigate to="/" /> :
            <>
              <NavBar />
              <Register />
            </>
        } />
        
        {/* Admin Routes with Fixed Layout */}
        <Route path="/admin/dashboard" element={
          isAdmin ?
            <>
              <AdminSidebar />
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </> :
            <Navigate to="/login" />
        } />
        
        {/* Fixed the route to match sidebar path */}
        <Route path="/admin/add_vehicle" element={
          isAdmin ?
            <>
              <AdminSidebar />
              <AdminLayout>
                <AddVehicle />
              </AdminLayout>
            </> :
            <Navigate to="/login" />
        } />
        
        <Route path="/admin/edit-vehicle/:id" element={
          isAdmin ?
            <>
              <AdminSidebar />
              <AdminLayout>
                <EditVehicle />
              </AdminLayout>
            </> :
            <Navigate to="/login" />
        } />
        
        {/* Fixed the route to match sidebar path */}
        <Route path="/admin/vehicle-list" element={
          isAdmin ?
            <>
              <AdminSidebar />
              <AdminLayout>
                <VehicleList />
              </AdminLayout>
            </> :
            <Navigate to="/login" />
        } />
        
        <Route path="/admin/view-vehicle/:id" element={
          isAdmin ?
            <>
              <AdminSidebar />
              <AdminLayout>
                <ViewVehicles />
              </AdminLayout>
            </> :
            <Navigate to="/login" />
        } />
        
        {/* Add other admin routes for consistency */}
        <Route path="/admin/view-vehicles" element={
          isAdmin ?
            <>
              <AdminSidebar />
              <AdminLayout>
                <ViewVehicles />
              </AdminLayout>
            </> :
            <Navigate to="/login" />
        } />
        
        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={
          isCustomer ?
            <>
              <CustomerNavbar />
              <CustomerBody />
              <CustomerFooter />
            </> :
            <Navigate to="/login" />
        } />
        <Route path="/customer/book-ride" element={
          isCustomer ?
            <>
              <CustomerNavbar />
              <BookingPage />
              <CustomerFooter />
            </> :
            <Navigate to="/login" />
        } />
        <Route path="/customer/bookings" element={
          isCustomer ?
            <>
              <CustomerNavbar />
              <CustomerBookings />
              <CustomerFooter />
            </> :
            <Navigate to="/login" />
        } />
        <Route path="/customer/track-ride/:id" element={
          isCustomer ?
            <>
              <CustomerNavbar />
              <TrackRide />
              <CustomerFooter />
            </> :
            <Navigate to="/login" />
        } />
        
        {/* Driver Routes */}
        <Route path="/driver/dashboard" element={
          isDriver ?
            <>
              <DriverHeader />
              <DriverDashboard />
              <DriverFooter />
            </> :
            <Navigate to="/login" />
        } />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;