import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import host from "../../api";

const CreateVacancyPage = () => {
    const user_id = JSON.parse(localStorage.getItem('user_id'))
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [time, setTime] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const data = {
                order_id: selectedOrder,
                title: title,
                description: description,
                price: price,
                time: time,
            }

            await axios.post(`${host}/vacancies/${user_id}/post`,
                data);
            navigate('/team')
        } catch (error) {
            console.error('Ошибка при создании вакансии:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${host}/order/orders/manager/${user_id}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
        }
    };

    return (
        <div className="container">
            <h1 className="mt-4">Создание новой вакансии</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Название</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea className="form-control" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Цена</label>
                    <input type="number" className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="time" className="form-label">Время</label>
                    <input type="text" className="form-control" id="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="order" className="form-label">Выберите заказ</label>
                    <select className="form-select" value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)} required>
                        <option value="">Выберите заказ</option>
                        {orders.map(order => (
                            <option key={order.order_id} value={order.order_id}>{order.title}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Создать</button>
            </form>
        </div>
    );
};

export default CreateVacancyPage;
