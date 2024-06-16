// src/components/Dashboard.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <NavLink to="/dashboard/create-project">Create a Project</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/view-projects">View Project List</NavLink>
          </li>
        </ul>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
