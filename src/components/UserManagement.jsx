// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    if (selectedUser && newRole) {
      await updateDoc(doc(firestore, 'users', selectedUser), {
        role: newRole
      });
      setUsers(users.map(user => (user.id === selectedUser ? { ...user, role: newRole } : user)));
      setSelectedUser(null);
      setNewRole('');
    }
  };

  return (
    <div className="user-management-container">
      <h3>User Management</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Assign New Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select value={user.id === selectedUser ? newRole : ''} onChange={(e) => {
                  setSelectedUser(user.id);
                  setNewRole(e.target.value);
                }}>
                  <option value="" disabled>Select role</option>
                  <option value="master">Master</option>
                  <option value="client">Client</option>
                  <option value="internalHead">Internal Head</option>
                  <option value="crew">Crew</option>
                </select>
                <button onClick={handleRoleChange}>Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
