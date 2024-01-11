import React, {useState, useEffect} from "react";
import AuthPage from "./components/pages/auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from "./components/pages/profile";
import MainPage from "./components/pages/main";
import ExchangePage from "./components/pages/exchange";
import CreateOrderPage from "./components/pages/order_create";
import ResponsePage from "./components/pages/response";
import MyOrdersPage from "./components/pages/myorders";
import OrderResponsesPage from "./components/pages/order_responses";


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="auth" element={<AuthPage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/create_order" element={<CreateOrderPage/>}/>
                <Route path="/response/:orderId" element={<ResponsePage/>} />
                <Route path="/order/:orderId/responses" element={<OrderResponsesPage/>} />
                <Route path="/my-orders" element={<MyOrdersPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;

