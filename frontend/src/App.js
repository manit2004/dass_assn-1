import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';
import UpdateUser from './pages/updateuser';
import Search from './pages/search';
import Items from './pages/items';
import MyCart from './pages/mycart';
import Sell from './pages/sell';
import Delivery from './pages/delivery';
import ConfirmOrder from './pages/confirm_order';
import Orders from './pages/orders';
import CasTest from './pages/CasTest';
import Welcome from './pages/welcome';
import Chatbot from './pages/chatbot';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/:token" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<User />} />
          <Route path="/userUpdate" element={<UpdateUser />} />
          <Route path="/search" element={<Search />} />
          <Route path="/items" element={<Items />} />
          <Route path="/mycart" element={<MyCart />} /> 
          <Route path="/checkout" element={<div>Checkout Page</div>} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/recd_orders" element={<Delivery />} />
          <Route path="/cnfm_order" element={<ConfirmOrder />} />
          <Route path="/order_details" element={<Orders />} />
          <Route path="/cas" element={<CasTest />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
