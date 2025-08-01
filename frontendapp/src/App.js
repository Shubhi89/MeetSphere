import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage.jsx';
import SignIn from './pages/signIn.jsx';
import SignUp from './pages/signUp.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { AuthProvider } from './contexts/authContext.jsx';
import Navbar from './pages/navbar.jsx';
import VideoMeet from './pages/videoMeet.jsx';
import GuestPage from './pages/guestPage.jsx';
import UserPage from './pages/userPage.jsx';
import HomePage from './pages/homePage.jsx';
import HistoryPage from './pages/historyPage.jsx';

 
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<>
              <Navbar />
              <SignIn /></>} />
            <Route path='/signup' element={<>
              <Navbar />
              <SignUp /></>} />
            <Route path='/guest' element={<>
              <Navbar />
              <GuestPage /></>} />
            <Route path='/userPage' element={<>
              <UserPage /></>} />
            <Route path='/url' element={<VideoMeet />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/history' element={<HistoryPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
