import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import ExchangePage from "./exchange";
import MyOrdersPage from "./myorders";
import host from "../../api";



const MainPage = () =>{
    const navigate = useNavigate()

    const user_id = JSON.parse(localStorage.getItem('user_id'))
    const logged_in = !(user_id == null)
    const [accountType, setAccountType] = useState('')
    const [loading, setLoading] = useState(true)


    useEffect(() =>{
        const fetchUserData = async () =>{
            try{
                const response = await axios.get(`${host}/auth/get_account_type/${user_id}`)
                setAccountType(response.data)
                console.log(response.data)
                setLoading(false)
            }
            catch (error){
                console.error(error)
            }
        }
        if(!logged_in){
            navigate('/auth')
        }
        else{
            if (loading){
                fetchUserData()
            }
        }
    })


    const header_props = {
        account_type: accountType
    }

    return(
        <div>
            {loading ? (
                <p>Загрузка..</p>
            ) : (

                <div>
                    {accountType === 'freelancer' ? (
                        <MyOrdersPage/>
                    ) : accountType === 'manager' ? (
                        <ExchangePage props={accountType}/>
                    ) : accountType === 'customer' ?(
                        <ExchangePage props={accountType}/>
                    ) : (
                        navigate('/auth')
                    )}
                </div>


            )}

        </div>

    )


}

export default MainPage