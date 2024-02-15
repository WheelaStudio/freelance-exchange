import React, {useState, useEffect} from "react";
import axios from "axios";
import {Button, Container, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import host from "../../api";

const AuthPage = ( ) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('customer'); // По умолчанию 'customer'
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = `${host}/auth/register`; // Вставьте URL вашего API регистрации или входа
      let requestData = {
        email: email,
        password: password,
      };

      let registerData = {
        name: name,
        email: email,
        password: password,
        account_type: accountType,
      }


      if (isLogin) {
        // Запрос на вход
        url = `${host}/auth/login`; // Вставьте URL вашего API входа
        const response = await axios.post(url, requestData);

        localStorage.setItem('user_id', JSON.stringify(response.data.user_id))
        localStorage.setItem('account_type', response.data.account_type)

        if(response.data.account_type === 'freelancer'){
          navigate('/profile')
        }
        else {
          navigate('/')
        }
        console.log(response.data);

      } else {
        // Запрос на регистрацию
        const response = await axios.post(url, registerData);
        console.log('Успешная регистрация:', response.data);
      }
    } catch (error) {
      console.log(error.response.data)
    }
  };

  return (
    <Container className="mt-5">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <Form.Group controlId="formBasicName">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        )}

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email адрес</Form.Label>
          <Form.Control
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {!isLogin && (
          <Form.Group controlId="formBasicAccountType">
            <Form.Label>Тип аккаунта</Form.Label>
            <Form.Control
              as="select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="customer">Заказчик</option>
              <option value="freelancer">Фрилансер</option>
              <option value="manager">Менеджер</option>
            </Form.Control>
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Form>

      <p className="mt-3">
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </Button>
      </p>
    </Container>
  );

}

export default AuthPage;
