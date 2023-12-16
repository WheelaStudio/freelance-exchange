import React, {useState, useEffect} from "react";
import AuthPage from "./components/pages/auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from "./components/pages/profile";

const App = () => {


    const [user_id, set_user_id] = useState(null)

    const setUser = (id) =>{
        set_user_id(id)
    }


    return (
        <BrowserRouter>
            <Routes>
                <Route path="auth" element={<AuthPage/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default App;

