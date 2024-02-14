import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResponsesPage = () => {
    const { vacancyId } = useParams();
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/vacancies/${vacancyId}/responses`);
            setResponses(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке откликов:', error);
        }
    };

    const handleStartWork = async (freelancer_id, order_id, response_id) => {
        try {
            await axios.post(`http://localhost:8000/tracker/team/${order_id}/add_freelancer/${freelancer_id}`);
            await axios.delete(`http://localhost:8000/vacancies/responses/${response_id}/delete`)
            fetchResponses()
            // Дополнительные действия после успешного начала работы с фрилансером
        } catch (error) {
            console.error('Ошибка при начале работы с фрилансером:', error);
        }
    };

    const renderResponses = () => {
        return responses.map(response => (
            <div key={response.id} className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Отклик #{response.response_id}</h5>
                    <p className="card-text">Описание: {response.description}</p>
                    <button className="btn btn-success" onClick={() => handleStartWork(response.freelancer_id,
                        response.order_id, response.response_id)}>Начать работу</button>
                </div>
            </div>
        ));
    };

    return (
        <div className="container">
            <h1 className="mt-4">Отклики на вакансию</h1>
            {responses.length > 0 ? renderResponses() : <p>Нет откликов на данную вакансию</p>}
        </div>
    );
};

export default ResponsesPage;
