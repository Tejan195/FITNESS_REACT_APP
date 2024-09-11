import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Section from "./components/Section";
import Services from "./components/Services";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import RunningTrack from "./components/RunningTrack";
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);
Layout.propTypes={
  children:PropTypes.node.isRequired,
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Hero />
              <Section />
              <Services />
              <ContactPage />
            </Layout>
          }
        />
        <Route
          path="/running-track"
          element={
            <Layout>
              <RunningTrack />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
