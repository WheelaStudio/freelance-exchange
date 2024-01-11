import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

const ResponsePage = () => {


  const { orderId } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderData, setOrderData] = useState({});
  const user_id = JSON.parse(localStorage.getItem('user_id'))


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/order/${orderId}`);
        setOrderData(response.data); // Получение данных о заказе
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных о заказе:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleSendResponse = async () => {
    try {
      setSubmitting(true);

      const response_data = {
        manager_id: user_id,
        description: responseText
      }

      await axios.post(`http://localhost:8000/order/${orderId}/response`, response_data);
      console.log('Отклик отправлен успешно');
      setSubmitting(false);
      setResponseText('');
      nav('/')
    } catch (error) {
      console.error('Ошибка при отправке отклика:', error);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container mt-4">

      </div>
      <h1>Отклик на заказ</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div>
          <h3>Информация о заказе:</h3>
          <p><strong>Название:</strong> {orderData.title}</p>
          <p><strong>Описание:</strong> {orderData.description}</p>
          <p><strong>Бюджет:</strong> {orderData.price} рублей</p>
          <p><strong>Сроки:</strong> {orderData.time} дней</p>
          <hr />
          <h3>Отправить отклик:</h3>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Введите текст отклика..."
          ></textarea>
          <br />
          <button onClick={handleSendResponse} disabled={submitting}>
            {submitting ? 'Отправка...' : 'Отправить отклик'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsePage;
