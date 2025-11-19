import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import CreateGroup from './pages/CreateGroup/CreateGroup';
import Dashboard from './pages/Dashboard/Dashboard';
import GroupDetails from './pages/GroupDetails/GroupDetails';
import Reports from './pages/Reports/Reports';
import Invitation from './pages/Invitation/Invitation';
import JoinGroup from './pages/JoinGroup/JoinGroup';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invitation/:groupId" element={<Invitation />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/group/:groupId" element={<GroupDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports/:groupId" element={<Reports />} />
          <Route path="/groups/:groupId/join" element={<JoinGroup />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;