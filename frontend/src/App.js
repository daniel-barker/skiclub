import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PortfolioBanner from "./components/PortfolioBanner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/PowderPostTheme.css";
import "./assets/css/App.css";
import "./assets/css/HeaderAndFooter.css";
import "./assets/css/NewsAndBulletin.css";

const App = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <ScrollToTop />
      <PortfolioBanner />
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <ToastContainer autoClose={1500} />
      <Footer />
    </div>
  );
};

export default App;
