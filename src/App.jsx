import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home/Home';
import { Register } from './components/Admin/Register';
import { Login } from './components/Login/Login';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/navbar/Navbar';
import { Sidebar } from './components/sidebar/Sidebar';
import { Hero } from './components/Hero/Hero';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import AddInfringement from './components/AddInfringement/AddInfringement';
import Container from './components/layout/Container';

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <Container>
        <Sidebar />
        <Layout>
          <Navbar />
          <AnimatePresence>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <Hero><Login /></Hero>} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/add" element={
                <ProtectedRoute>
                  <AddInfringement />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute>
                  <Register />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Container>
    </AuthProvider>
  );
};

export default App;


