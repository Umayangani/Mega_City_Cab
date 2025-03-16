import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="app-container">
      {/* The sidebar component is rendered separately in the Routes */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;