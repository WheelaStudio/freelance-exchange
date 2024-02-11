import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

const OrderResponsesPage = () => {
  const { orderId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = JSON.parse(localStorage.getItem('user_id'))

  const nav = useNavigate()

  useEffect(() => {


    const fetchResponses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/order/${orderId}/responses`);
        setResponses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке откликов на заказ:', error);
        setLoading(false);
      }
    };

    fetchResponses();
  }, [orderId]);

  const handleSetOrderStatus = async (responseId) => {
  try {

    await axios.put(`http://localhost:8000/order/${orderId}/change`);
    await axios.post(`http://localhost:8000/tracker/create/?order_id=${orderId}&manager_id=${user_id}`)
    nav(`/order/${orderId}/tracker`)
  } catch (error) {
    console.error('Ошибка при изменении статуса заказа:', error);
  }
  };

  return (
    <div className="container mt-4">
      <h1>Отклики на заказ {orderId}</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul className="list-group">
          {responses.map((response) => (
            <li key={response.response_id} className="list-group-item bg-light mb-2">
              <p>{response.description}</p>
              <button
                className="btn btn-warning"
                onClick={() => handleSetOrderStatus(response.id)}
              >
                Начать работу
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderResponsesPage;