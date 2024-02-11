import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import Header from "../header";

const MyOrdersPage = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user_id = JSON.parse(localStorage.getItem('user_id'))
  const logged_in = !(user_id == null)
  const [accountType, setAccountType] = useState('')
  const [loadingUserData, setLoadingUserData] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response_user_data = await axios.get(`http://localhost:8000/auth/get_account_type/${user_id}`)
        setAccountType(response_user_data.data)

        let response;

        if (response_user_data.data === "customer"){
            response = await axios.get(`http://localhost:8000/order/orders/?page=1&page_size=12&user_id=${user_id}`);
        }
        else if (response_user_data.data === "freelancer"){
            response = await axios.get(`http://localhost:8000/order/orders/freelancer/${user_id}`);
        }
        else if (response_user_data.data === "manager"){
            response = await axios.get(`http://localhost:8000/order/orders/manager/${user_id}`)
        }

        setMyOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        setLoading(false);
      }
    };
    const fetchUserData = async () =>{
      try{

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
            fetchMyOrders(accountType)
        }
    }

  }, []);

  return (
    <div>
        <Header props={accountType}></Header>
        <div className="container mt-4">
          <h1>Мои заказы</h1>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <ul className="list-group">
              {myOrders.map((order) => (
                <li key={order.order_id} className="list-group-item bg-light mb-2">
                  <h3>{order.title}</h3>
                  <p>{order.description}</p>
                  <p><strong>Бюджет:</strong> {order.price}</p>
                  <p><strong>Сроки:</strong> {order.time}</p>
                     {order.status === 'not_started' && (
                        <div>
                          {/* Кнопка для просмотра откликов */}
                          <Link to={`/order/${order.order_id}/responses`} className="btn btn-primary">
                            Посмотреть отклики
                          </Link>
                        </div>
                    ) }
                     {order.status === 'working' && (
                        <div>
                          {/* Кнопка для просмотра откликов */}
                          <Link to={`/order/${order.order_id}/tracker`} className="btn btn-primary">
                            Отслеживание задач
                          </Link>
                        </div>
                    ) }
                </li>
              ))}
            </ul>
          )}
        </div>
    </div>
  );
};

export default MyOrdersPage;

