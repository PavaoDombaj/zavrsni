import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Clients from "./Clients";
import Featured from "./components/Featured";
import Prices from "./components/Prices";
import Profile from "./Profile";
import "./index.css";
import Registration from "./Registration";
import Login from "./Login";
import SalonPage from "./SalonPage"
import Reserve from "./Reserve";
import ReserveTime from "./ReserveTime";
import Dashboard from "./Dashboard";
import ReserveFinal from "./ReserveFinal"
import MyReservations from "./MyReservations";
import AdminSalon from "./AdminSalon";
import AdminUsers from "./AdminUsers";
import AdminCreateSalon from "./AdminCreateSalon";
import { SalonDashboard } from "./components";

const SalonRoutes = () => {
  return (
    <div>
      {/* Routes for /clients/* */}
      <Routes>
        <Route path="/" element={<Featured />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reservations" element={<MyReservations />} />
        <Route path="/salon/:id" element={<SalonPage />} />
        <Route path="/salon/:id/reserve" element={<Reserve />} />
        <Route path="/salon/:id/reserve/time" element={<ReserveTime />} />
        <Route path="/salon/:id/reserve/final" element={<ReserveFinal />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients/*" element={<SalonRoutes />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/admin/" element={<Dashboard />} />
        <Route path="/admin/salon" element={<AdminSalon />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/createsalon" element={<AdminCreateSalon />} />
        <Route path="/partner/dashboard/salon" element={<SalonDashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
