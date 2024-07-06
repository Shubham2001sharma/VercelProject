import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
// import About from './components/About';
// import Contact from './components/Contact';
// import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element=<Signup/> />
          <Route path="/login" element=<Login/> />
          <Route path="/dashboard" element=<Dashboard/> />

          {/* <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} /> This will catch any undefined routes */}
        </Routes>
    
    </Router>
  );
}

export default App;
