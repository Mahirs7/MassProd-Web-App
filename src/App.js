// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ChatProvider } from 'stream-chat-react';

import Login from './components/Login';
import MasterDashboard from './components/MasterDashboard';
import ClientDashboard from './components/ClientDashboard';
import InternalHeadDashboard from './components/InternalHeadDashboard';
import CrewDashboard from './components/CrewDashboard';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import LocationScout from './components/LocationScout';
import Crew from './components/Crew';
import Schedule from './components/Schedule';
import DailyCallSheet from './components/DailyCallSheet';
import UserManagement from './components/UserManagement';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';
import client from './stream'; // Import the Stream client

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(firestore, 'users'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setRole(userData.role);

          // Fetch the Stream token for the authenticated user
          // const tokenResponse = await fetch('/api/stream-token', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ userId: user.uid }),
          // });
          // const { token } = await tokenResponse.json();
          // setToken(token);
        } else {
          setRole('unassigned');
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while determining the auth state
  }

  return (
    <Router>
      {/* <ChatProvider client={client} token={token} user={user}> */}
        <Routes>
          {!user ? (
            <Route path="/login" element={<Login />} />
          ) : (
            <>
              {role === 'master' && (
                <Route path="/dashboard/*" element={<MasterDashboard />}>
                  <Route path="create-project" element={<ProjectForm />} />
                  <Route path="view-projects" element={<ProjectList />} />
                  <Route path="manage-users" element={<UserManagement />} />
                  <Route path="*" element={<ProjectList />} />
                </Route>
              )}
              {role === 'client' && (
                <Route path="/dashboard/*" element={<ClientDashboard />}>
                  <Route path="view-projects" element={<ProjectList />} />
                  <Route path="*" element={<ProjectList />} />
                </Route>
              )}
              {role === 'internalHead' && (
                <Route path="/dashboard/*" element={<InternalHeadDashboard />}>
                  <Route path="view-projects" element={<ProjectList />} />
                  <Route path="*" element={<ProjectList />} />
                </Route>
              )}
              {role === 'crew' && (
                <Route path="/dashboard/*" element={<CrewDashboard />}>
                  <Route path="view-projects" element={<ProjectList />} />
                  <Route path="*" element={<ProjectList />} />
                </Route>
              )}
              <Route path="/project/:projectId/*" element={<ProjectDetails />}>
                <Route path="location-scout" element={<LocationScout />} />
                <Route path="crew" element={<Crew />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="daily-call-sheet" element={<DailyCallSheet />} />
              </Route>
              <Route path="/chats" element={<ChatList />} />
              <Route path="/chat/:chatId" element={<ChatRoom />} />
              {role === 'unassigned' && <Route path="*" element={<Navigate to="/login" />} />}
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </>
          )}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      {/* </ChatProvider> */}
    </Router>
  );
};

export default App;
