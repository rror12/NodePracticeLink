import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Notes from './components/Notes';
import FriendsTab from './components/FriendsTab';
import NotificationsTab from './components/NotificationsTab';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/friends" element={<FriendsTab />} />
        <Route path="/notification" element={<NotificationsTab />} />
      </Routes>
    </Router>
  );
}

export default App;
