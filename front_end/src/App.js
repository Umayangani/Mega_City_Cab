import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; 
import Sidebar from './adminDashboard/Sidebar'; 
import Dashboard from './adminDashboard/Dashboard'; 
import AddVehicle from './pages/AddVehicle'; 
import ViewVehicles from './pages/ViewVehicles'; 
import EditVehicle from './pages/EditVehicle'; 
import './App.css'; 

const MainContent = () => { const location = useLocation(); 
return( 
  <div className="main-content">
    <Routes>
      <Sidebar />
      <Route path="/" element={<Dashboard />} />
      <Route path="/AddVehicle" element={<AddVehicle />} /> 
      <Route path="/ViewVehicles" element={<ViewVehicles />} /> 
      <Route path="/EditVehicle/:id" element={<EditVehicle />} /> 
    </Routes> </div>); }; 

  const App = () => { return (<Router><div className="app-container"><Sidebar /> <MainContent /></div></Router>); }; 

export default App;