import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";

const OrderResponsesPage = () => {
  const { orderId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    // Предположим, что у вас есть API-метод для изменения статуса заказа
    await axios.put(`http://localhost:8000/order/${orderId}/change`);

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