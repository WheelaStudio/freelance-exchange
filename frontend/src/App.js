import React, {useState, useEffect} from "react";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";

import AuthPage from "./components/pages/auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from "./components/pages/profile";




const App = () => {
    const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
        <Routes>
            <Route path="auth" element={<AuthPage userData={setUser}/>}/>
            <Route path="profile" element={<ProfilePage/>}/>
        </Routes>
    </BrowserRouter>
  )

}

export default App;
