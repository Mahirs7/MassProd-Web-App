// src/components/CrewDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Dashboard.css';

const CrewDashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;
        const q = query(collection(firestore, 'projects'), where('assignedUsers', 'array-contains', { email: userEmail, role: 'crew' }));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(projectsData);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Crew Dashboard</h2>
        <ul>
          <li>
            <Link to="view-projects">View Project List</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <h3 className="project-title">Assigned Projects</h3>
        <div className="project-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <div>
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                </div>
                <div className="project-actions">
                  <Link to={`/project/${project.id}`}>
                    <button className="btn-view">View Project</button>
                  </Link>
                </div>
              </div>
              <div className="project-assigned-users">
                <UsersIcon className="users-icon" />
                <div className="assigned-users">
                  {project.assignedUsers && project.assignedUsers.length > 0
                    ? project.assignedUsers.map(user => (
                        <span key={user.email}>{`${user.email} (${user.role})`}</span>
                      )).reduce((prev, curr) => [prev, ', ', curr])
                    : 'No assigned users'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default CrewDashboard;
