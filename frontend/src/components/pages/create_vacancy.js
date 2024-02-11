import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const CreateVacancyPage = () => {
    const user_id = JSON.parse(localStorage.getItem('user_id'))
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [time, setTime] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const data = {
                title: title,
                description: description,
                price: price,
                time: time,
            }

            await axios.post(`http://localhost:8000/vacancies/${user_id}/post`,
                data);
            navigate('/team')
        } catch (error) {
            console.error('Ошибка при создании вакансии:', error);
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
                <button type="submit" className="btn btn-primary">Создать</button>
            </form>
        </div>
    );
};

export default CreateVacancyPage;
