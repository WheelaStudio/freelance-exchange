import React, {useState, useEffect} from "react";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";
import Header from "../header";
import {useNavigate} from "react-router-dom";
import host from "../../api";



const ProfilePage = () => {

    const [hourlyRate, setHourlyRate] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [loading, setLoading] = useState(true)
    const user_id = JSON.parse(localStorage.getItem('user_id'))
    const account_type = localStorage.getItem('account_type')

    const navigate = useNavigate()



    useEffect(() =>{
        const fetchUserData = async () => {
            try{
                const response = await axios.get(`${host}/profile/${user_id}`)
                setHourlyRate(response.data.rate)
                setSkills(response.data.skills)
                setExperience(response.data.description)
                setLoading(false)
            }
            catch (error){
                console.error(error)

            }
        }
        if(loading){
            fetchUserData();
        }

    })

    const handleProfileUpdate = async (e) => {
        e.preventDefault();



        try {
            const profileData = {
                rate: hourlyRate,
                skills: skills,
                description: experience,
            };



            const response = await axios.put(`${host}/profile/edit/${user_id}`, profileData);

            console.log('Данные профиля сохранены:', response.data);
            navigate('/')
            // Дополнительная логика после успешного сохранения...
        } catch (error) {
            console.error('Ошибка сохранения данных профиля:', error);
            // Обработка ошибки сохранения данных...
        }
    };

    return (
        <div>
        <Header props="freelancer"></Header>
        <Container className="mt-5">

            <h2>Профиль фрилансера</h2>
            {loading ? (
                <p>Загрузка данных профиля...</p>
            ) : (
                <Form onSubmit={handleProfileUpdate}>

    <Form.Group controlId="formHourlyRate">
        <Form.Label>Часовая ставка</Form.Label>
        <Form.Control
            type="text"
            placeholder="Введите часовую ставку"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
        />

    </Form.Group>

    <Form.Group controlId="formSkills">
        <Form.Label>Навыки</Form.Label>
        <Form.Control
            as="textarea"
            rows={3}
            placeholder="Укажите навыки через запятую"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
        />
    </Form.Group>

    <Form.Group controlId="formExperience">
        <Form.Label>Опыт работы</Form.Label>
        <Form.Control
            as="textarea"
            rows={5}
            placeholder="Опишите свой опыт работы"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
        />
    </Form.Group>

    <Button variant="primary" type="submit">
        Сохранить профиль
    </Button>
</Form>
            )}

        </Container>

        </div>
    );


}

export default ProfilePage;
