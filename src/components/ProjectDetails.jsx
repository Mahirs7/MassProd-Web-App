// src/components/ProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = await getDoc(doc(firestore, 'projects', projectId));
      if (projectDoc.exists()) {
        setProject(projectDoc.data());
      } else {
        console.error("No such document!");
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-details-container">
      <nav className="project-navbar">
        <span className="project-name">{project.name}</span>
        <Link to="location-scout">Location Scout</Link>
        <Link to="crew">Crew</Link>
        <Link to="schedule">Schedule</Link>
        <Link to="daily-call-sheet">Daily Call Sheet</Link>
        <button className="btn-back" onClick={() => navigate('/dashboard/view-projects')}>Back</button>
      </nav>
      <Outlet />
    </div>
  );
};

export default ProjectDetails;
