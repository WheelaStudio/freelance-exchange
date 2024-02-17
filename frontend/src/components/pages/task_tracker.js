import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Table, Form, Button, Row, Col, Alert} from 'react-bootstrap';
import Header from "../header";
import {json, useParams} from "react-router-dom";
import host from "../../api";

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState('');
  const account_type = localStorage.getItem('account_type')
  const { orderId } = useParams();

  const [error, setError] = useState('');
  const [selectedFreelancers, setSelectedFreelancers] = useState([]);
  let trackerId = 0

  useEffect(() => {
    const fetchTasks = async () => {
      try {

        trackerId = await axios.get(`${host}/tracker/get-id/${orderId}`)

        const tasksResponse = await axios.get(`${host}/tracker/${trackerId}/tasks`);
        setTasks(tasksResponse.data);

        console.log(tasks)

        const usersResponse = await axios.get(`${host}/tracker/${trackerId}/team`);

        setUsers(usersResponse.data);
        setLoading(false);

        console.log(users)

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);


  const handleAddUser = async () => {
    try {
      const response = await axios.post(`${host}/tracker/team/${trackerId}/add_freelancer/${newUserId}/`);
      const newUser = response.data; // Предположим, что в ответе приходит новый пользователь
      setUsers([...users, newUser]);
      console.log('Новый пользователь добавлен:', newUser);
      setNewUserId(''); // Очищаем поле ввода после успешного добавления
      // eslint-disable-next-line no-restricted-globals
      location.reload()
    } catch (error) {
      console.error('Ошибка при добавлении нового пользователя:', error);
    }
  };

  const handleFieldChange = (taskId, field, value) => {
    const updatedData = tasks.map(task => {
      if (task.task_id === taskId) {
        return { ...task, [field]: value };
      }
      return task;
    });

    setTasks(updatedData);
  };



  const handleSaveAllChanges = async () => {
    try {


      for (let task of tasks){
        await saveToApi(task)
      }

      console.log('Все изменения успешно сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении изменений:', error);
    }
  };

  const saveToApi = async (t) => {

    const task = {
      title: t.title,
      start_date: t.start_date,
      end_date: t.end_date,
      freelancer_id: t.freelancer_id,
      progress: t.progress
    };

    console.log(t.task_id)

    const response = await axios.put(
          `${host}/tracker/${trackerId}/task/${t.task_id}`, task)



  }

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
          `${host}/tracker/${trackerId}/create_task`);
      const newTask = response.data;

      setTasks([...tasks, newTask]);
      console.log('Новая задача успешно добавлена:', newTask);
      // eslint-disable-next-line no-restricted-globals
      location.reload()
    }
    catch (error) {
      console.error('Ошибка при добавлении новой задачи:', error);
    }
  };



    const handleRemoveFreelancer = async (freelancerId) => {
      try {
        const response = await axios.delete(
            `${host}/tracker/${trackerId}/team/freelancer/${freelancerId}/delete`);
        // eslint-disable-next-line no-restricted-globals
        location.reload()
      }
      catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    };


    const handleRemoveTask = async (taskId) => {
      try {
        const response = await axios.delete(
            `${host}/tracker/${trackerId}/task/${taskId}/delete`);
        // eslint-disable-next-line no-restricted-globals
        location.reload()
      }
      catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    };




  return (
    <div>
      <Header props={account_type}></Header>
      <h1>Таск трекер</h1>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div>

        <Row className="mb-3">
          <Col xs={4}>
            <Form.Control
              type="text"
              placeholder="ID исполнителя"
              value={newUserId}
              onChange={(event) => setNewUserId(event.target.value)}

            />
          </Col>
          <Col>
            <Button variant="info" onClick={handleAddUser}>Добавить исполнителя</Button>
            <Button variant="success" onClick={handleAddTask}>Добавить новую задачу</Button>
          </Col>
          {error && <Alert variant="danger">{error}</Alert>}
        </Row>

        <table className="table">
          <thead>
              <tr>
                  <th scope="col">Имя</th>
                  <th scope="col">Email</th>
                  <th scope="col">Действие</th>
              </tr>
          </thead>
          <tbody>
              {users.map(freelancer => (
                  <tr key={freelancer.freelancer_id}>
                      <td>{freelancer.name}</td>
                      <td>{freelancer.email}</td>
                      <td><button className="btn btn-danger" onClick={() => handleRemoveFreelancer(freelancer.freelancer_id)}>Удалить</button></td>
                  </tr>
              ))}
          </tbody>
        </table>

        <Table className={'striped bordered hover'}>

          <thead>
            <tr>
              <th>Название задачи</th>
              <th>Исполнитель</th>
              <th>Дата начала</th>
              <th>Дата конца</th>
              <th>Прогресс</th>
            </tr>
          </thead>
          <tbody>
              {tasks.map(task => (
                <tr key={task.task_id}>
                  <td>
                    <Form.Control
                      type="text"
                      value={task.title}
                      onChange={(e) => handleFieldChange(task.task_id, 'title', e.target.value)}
                    />
                  </td>
                  <td>
                   <Form.Control
                      as="select"
                      value={task.freelancer_id}
                      onChange={(e) => handleFieldChange(task.task_id, 'freelancer_id', e.target.value)}
                   >
                      <option value=''>Выберите исполнителя</option>
                      {users.map(user => (
                        <option key={user.freelancer_id}
                                value={user.freelancer_id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      value={task.start_date}
                      onChange={(e) => handleFieldChange(task.task_id, 'start_date', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="date"
                      value={task.end_date}
                      onChange={(e) => handleFieldChange(task.task_id, 'end_date', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={task.progress}
                      onChange={(e) => handleFieldChange(task.task_id, 'progress', e.target.value)}
                    />
                  </td>
                  <td><button className="btn btn-danger" onClick={() => handleRemoveTask(task.task_id)}>Удалить</button></td>

                </tr>
              ))}
            </tbody>
        </Table>
          <Button variant="success" onClick={handleSaveAllChanges}>Сохранить все изменения</Button>
        </div>
      )}
    </div>
  );

};


export default TasksTable;
