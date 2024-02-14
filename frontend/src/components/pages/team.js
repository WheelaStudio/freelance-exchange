import Header from "../header";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button} from "react-bootstrap";

const TeamPage = () => {
    const user_id = JSON.parse(localStorage.getItem('user_id'))
    const account_type = localStorage.getItem('account_type')
    const navigate = useNavigate()

    if (account_type != 'manager'){
        navigate('/')
    }

    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/vacancies/${user_id}/list`);
            setVacancies(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке вакансий:', error);
        }
    };

    const handleDeleteVacancy = async (vacancy_id) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/vacancies/${vacancy_id}/delete`);
            console.log(response.data)
            fetchVacancies()
        } catch (error) {
            console.error('Ошибка при удалении вакансии:', error);
        }
    }

    const renderVacancies = () => {
        return vacancies.map(vacancy => (
            <div key={vacancy.id} className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">{vacancy.title}</h3>
                    <p className="card-text">{vacancy.description}</p>
                    <p className="card-text">Цена: {vacancy.price} рублей</p>
                    <p className="card-text">Время: {vacancy.time} дней</p>
                    <Link to={`/vacancies/${vacancy.vacancy_id}/responses`} className="btn btn-primary">Просмотреть отклики</Link>
                    <button className="btn btn-danger" onClick={() => handleDeleteVacancy(vacancy.vacancy_id)}>Удалить вакансию</button>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <Header props={account_type}></Header>
            <div className="container">

                <h1 className="mt-4">Создание и управление вакансиями</h1>
                <Link to="/create-vacancy" className="btn btn-success mb-3">Создать вакансию</Link>
                <div className="row">
                    <div className="col-md-8">
                        <h2 className="mb-3">Активные вакансии:</h2>
                        {vacancies.length > 0 ? renderVacancies() : <p>Нет активных вакансий</p>}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default TeamPage;