// src/components/ProjectForm.jsx
import React, { useState } from 'react';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './ProjectForm.css';

const ProjectForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('client'); // Default role

  const handleAddUser = () => {
    if (userEmail && userRole && !assignedUsers.some(user => user.email === userEmail)) {
      setAssignedUsers([...assignedUsers, { email: userEmail, role: userRole }]);
      setUserEmail('');
      setUserRole('client'); // Reset to default role
    }
  };

  const handleRemoveUser = (email) => {
    setAssignedUsers(assignedUsers.filter(user => user.email !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'projects'), {
        name,
        description,
        assignedUsers,
      });
      setName('');
      setDescription('');
      setAssignedUsers([]);
      alert('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="project-form-container">
      <h3>Create New Project</h3>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectDescription">Project Description</label>
          <textarea
            id="projectDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="assignUser">Assign Users</label>
          <input
            type="email"
            id="assignUser"
            placeholder="User Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="internalHead">Internal Head</option>
            <option value="crew">Crew</option>
          </select>
          <button type="button" onClick={handleAddUser} className="btn-add-user">Add User</button>
          <ul>
            {assignedUsers.map((user, index) => (
              <li key={index}>
                {`${user.email} (${user.role})`}
                <button type="button" onClick={() => handleRemoveUser(user.email)} className="btn-remove-user">Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn">Create Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;
