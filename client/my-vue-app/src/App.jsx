// import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import EditNote from './components/EditNote';

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Navbar />

      <hr />

      <Outlet />
    </div>
  );
}

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes/:id" element={<EditNote />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
