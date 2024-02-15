import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Header from "../header";
import host from "../../api";

const ApplyVacancyPage = () => {
    const { vacancyId } = useParams();
    const userId = JSON.parse(localStorage.getItem('user_id'))
    const [vacancy, setVacancy] = useState(null);
    const [description, setDescription] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        fetchVacancy();
    }, []);

    const fetchVacancy = async () => {
        try {
            const response = await axios.get(`${host}/vacancies/${vacancyId}`);
            setVacancy(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке вакансии:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                order_id: vacancy.order_id,
                freelancer_id: userId,
                description: description
            }
            await axios.post(`${host}/vacancies/${vacancyId}/post/response`, data);
            // Redirect or show success message after successful submission
            navigate('/vacancies')
        } catch (error) {
            console.error('Ошибка при отправке отклика:', error);
        }
    };

    return (
        <div>
            <Header props={'freelancer'}></Header>
            <div className="container">
                <h1 className="mt-4">Отклик на вакансию</h1>
                {vacancy ? (
                    <div className="card mb-3">
                        <div className="card-body">
                            <h3 className="card-title">{vacancy.title}</h3>
                            <p className="card-text">{vacancy.description}</p>
                            <p className="card-text">Цена: {vacancy.price}</p>
                            <p className="card-text">Время: {vacancy.time}</p>
                        </div>
                    </div>
                ) : (
                    <p>Загрузка...</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Текст отлкика</label>
                        <textarea className="form-control" id="description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Отправить отклик</button>
                </form>
            </div>
        </div>

    );
};

export default ApplyVacancyPage;
