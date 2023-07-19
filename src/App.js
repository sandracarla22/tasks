import React, {useState} from 'react';
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import ListPage from './view/ListPage'
import LoginPage from './view/LoginPage'
import './App.css';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage/>} />
          <Route path="/ListPage" element={<ListPage/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;

