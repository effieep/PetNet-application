import './App.css';
import NavBar from './components/NavBar'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home.js';
import Owner from './pages/owner.js';
import Vet from './pages/vet.js';
import LostFound from './pages/lost_found.js';
import Help from './pages/help.js';
import Profile from './pages/profile.js';
import SignUp from './pages/signup.js';
import Error404 from './pages/404.js';


function App() {

  return (
      <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/vet" element={<Vet />} />
        <Route path="/lost-found" element={<LostFound />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
      </>
  );
}

export default App;