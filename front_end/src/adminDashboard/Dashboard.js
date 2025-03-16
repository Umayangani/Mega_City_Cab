import React from "react";
import {
  FaCar,
  FaClipboardCheck,
  FaTimes,
  FaCalendarCheck,
  FaExclamationCircle,
  FaCheckCircle,
  FaDollarSign,
  FaUserTie,
  FaTools,
} from "react-icons/fa";

import './adminD.css';

const Dashboard = () => {
  return (
    <div className="p-5 bg-light">
      <h1 className="text-dark text-center mt-5">🎉 Welcome to Admin Dashboard</h1>

      {/* Cards Section */}
      <div className="row mt-4">
        {/* Card 1 - Available Cars */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaCar size={40} className="text-primary" />
              <h5 className="card-title mt-3">Available Cars</h5>
              <p className="card-text">Count: <strong>50</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 2 - Bookings Made */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaClipboardCheck size={40} className="text-success" />
              <h5 className="card-title mt-3">Bookings Made</h5>
              <p className="card-text">Count: <strong>200</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 3 - Bookings Canceled */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaTimes size={40} className="text-danger" />
              <h5 className="card-title mt-3">Bookings Canceled</h5>
              <p className="card-text">Count: <strong>5</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 4 - Today's Trips */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaCalendarCheck size={40} className="text-warning" />
              <h5 className="card-title mt-3">Today's Trips</h5>
              <p className="card-text">Count: <strong>12</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 5 - Pending Bookings */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaExclamationCircle size={40} className="text-info" />
              <h5 className="card-title mt-3">Pending Bookings</h5>
              <p className="card-text">Count: <strong>8</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Additional Cards */}

        {/* Card 6 - Completed Bookings */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaCheckCircle size={40} className="text-success" />
              <h5 className="card-title mt-3">Completed Bookings</h5>
              <p className="card-text">Count: <strong>180</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 7 - Revenue */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaDollarSign size={40} className="text-success" />
              <h5 className="card-title mt-3">Revenue</h5>
              <p className="card-text">Amount: <strong>$5000</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 8 - Active Drivers */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaUserTie size={40} className="text-primary" />
              <h5 className="card-title mt-3">Active Drivers</h5>
              <p className="card-text">Count: <strong>20</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 9 - Available Vehicles */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaCar size={40} className="text-warning" />
              <h5 className="card-title mt-3">Available Vehicles</h5>
              <p className="card-text">Count: <strong>15</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

        {/* Card 10 - Car Maintenance Due */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <FaTools size={40} className="text-danger" />
              <h5 className="card-title mt-3">Car Maintenance Due</h5>
              <p className="card-text">Count: <strong>3</strong></p> {/* Replace with dynamic data */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


export default Dashboard;