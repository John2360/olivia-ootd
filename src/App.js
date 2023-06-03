import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import firebase from './services/firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { createFuturePosts } from './services/posts';


import './assets/App.css';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    })
  }, [])

  useEffect(() => {
    createFuturePosts();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
