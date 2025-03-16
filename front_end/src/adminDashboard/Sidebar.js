import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaUsers,
  FaBook,
  FaMoneyBill,
  FaCogs,
  FaUserCog,
  FaSignOutAlt,
  FaAngleDown,
  FaAngleUp,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    vehicles: false,
    drivers: false,
    users: false,
    bookings: false,
    customers: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString());
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    {
      name: "Manage Vehicles",
      icon: <FaCar />,
      subMenu: [
        { name: "Add Vehicle", path: "/admin/add_vehicle" },
        { name: "View Vehicles", path: "/admin/vehicle-list" },
      ],
      dropdownState: "vehicles",
    },
    {
      name: "Manage Drivers",
      icon: <FaUsers />,
      subMenu: [
        { name: "Add Driver", path: "/admin/add-driver" },
        { name: "Edit Driver", path: "/admin/edit-driver" },
        { name: "View Drivers", path: "/admin/view-drivers" },
        { name: "Driver History", path: "/admin/driver-history" },
        { name: "Payments", path: "/admin/driver-payments" },
      ],
      dropdownState: "drivers",
    },
    {
      name: "Manage Users",
      icon: <FaUserCog />,
      subMenu: [
        { name: "Create User", path: "/admin/create-user" },
        { name: "Edit User", path: "/admin/edit-user" },
        { name: "View Users", path: "/admin/view-users" },
      ],
      dropdownState: "users",
    },
    {
      name: "Manage Bookings",
      icon: <FaBook />,
      subMenu: [
        { name: "Create Booking", path: "/admin/create-booking" },
        { name: "View Bookings", path: "/admin/view-bookings" },
        { name: "Edit Bookings", path: "/admin/edit-bookings" },
        { name: "Cancel Booking", path: "/admin/cancel-booking" },
      ],
      dropdownState: "bookings",
    },
    {
      name: "Manage Customer",
      icon: <FaUsers />,
      subMenu: [
        { name: "View Customers", path: "/admin/view-customers" },
        { name: "Customer History", path: "/admin/customer-history" },
        { name: "Customer Payment", path: "/admin/customer-payment" },
      ],
      dropdownState: "customers",
    },
    { name: "Payments & Reports", icon: <FaMoneyBill />, path: "/admin/payments" },
    { name: "Settings", icon: <FaCogs />, path: "/admin/settings" },
  ];

  return (
    <>
      <button
        className="btn btn-dark d-md-none m-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>
      <div 
        className={`sidebar bg-dark text-white vh-100 p-3 position-fixed ${isSidebarOpen ? 'd-block' : 'd-none d-md-block'}`} 
        style={{ width: "250px", height: "100vh" }}
      >
        <h3 className="text-center">
          Hi Admin <br /> <small>{currentDate}</small>
        </h3>
        <div style={{ height: "40px" }}></div>
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.subMenu ? (
                <div>
                  <div
                    className={`nav-link d-flex align-items-center justify-content-between text-white ${
                      active === item.name ? "bg-warning text-dark" : ""
                    }`}
                    onClick={() => {
                      setIsDropdownOpen((prev) => ({
                        ...prev,
                        [item.dropdownState]: !prev[item.dropdownState],
                      }));
                      setActive(item.name);
                    }}
                    style={{ marginBottom: "10px", cursor: "pointer" }}
                  >
                    <div>
                      <span className="me-2">{item.icon}</span> {item.name}
                    </div>
                    {isDropdownOpen[item.dropdownState] ? <FaAngleUp /> : <FaAngleDown />}
                  </div>
                  {isDropdownOpen[item.dropdownState] && (
                    <div className="ms-4">
                      {item.subMenu.map((subItem) => (
                        <Link
                          to={subItem.path}
                          key={subItem.name}
                          className={`nav-link text-white ${
                            active === subItem.name ? "bg-warning text-dark" : ""
                          }`}
                          onClick={() => setActive(subItem.name)}
                          style={{ cursor: "pointer", paddingLeft: "20px" }}
                        >
                          • {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center text-white ${
                    active === item.name ? "bg-warning text-dark" : ""
                  }`}
                  onClick={() => setActive(item.name)}
                  style={{ marginBottom: "20px", cursor: "pointer" }}
                >
                  <span className="me-2">{item.icon}</span> {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="nav-link mt-auto text-danger d-flex align-items-center" style={{ cursor: "pointer" }}>
          <FaSignOutAlt className="me-2" /> Logout
        </div>
      </div>
    </>
  );
};

export default Sidebar;