import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from "../header";

const DeveloperVacanciesPage = () => {
    const [vacancies, setVacancies] = useState([]);
    const accountType = localStorage.getItem('account_type')

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/vacancies/list/?page=1&page_size=10');
            setVacancies(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке вакансий:', error);
        }
    };

    const renderVacancies = () => {
        return vacancies.map(vacancy => (
            <div key={vacancy.id} className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">{vacancy.title}</h3>
                    <p className="card-text">{vacancy.description}</p>
                    <p className="card-text">Цена: {vacancy.price}</p>
                    <p className="card-text">Время: {vacancy.time}</p>
                    <Link to={`/vacancies/${vacancy.vacancy_id}/apply`} className="btn btn-primary">Откликнуться</Link>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <Header props={accountType}></Header>
            <div className="container">

                <h1 className="mt-4">Доступные вакансии</h1>
                <div className="row">
                    <div className="col-md-8">
                        {vacancies.length > 0 ? renderVacancies() : <p>Нет доступных вакансий</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperVacanciesPage;
