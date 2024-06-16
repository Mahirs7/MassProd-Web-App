// src/components/Login.jsx
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Query Firestore to check if user exists based on email
      const q = query(collection(firestore, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("User does not exist in Firestore");
        await auth.signOut();
        return;
      }

      const userData = querySnapshot.docs[0].data();
      if (userData.role === 'master') {
        navigate('/master-dashboard');  // Navigate to master dashboard
      } else {
        navigate('/dashboard');  // Navigate to general dashboard
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {/* {error && <p className="error-message">{error}</p>} */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">Login</button>
    </div>
  );
};

export default Login;
