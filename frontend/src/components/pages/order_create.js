import Header from "../header";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import host from "../../api";



const CreateOrderPage = () => {

    const navigate = useNavigate()

    const user_id = JSON.parse(localStorage.getItem('user_id'))
    const logged_in = !(user_id == null)
    const [accountType, setAccountType] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingOrderCreate, setLoadingOrderCreate] = useState(false)

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const status = "not_started";

            const order_data = {
              customer_id: user_id,
              title: title,
              description: description,
              price: price,
              time: time,
              status: "not_started"
            }

          const response = await axios.post(`${host}/order/create`, order_data);

          console.log('Заказ успешно создан:', response.data);
          // Здесь можно добавить переадресацию на страницу со списком заказов или что-то еще
        } catch (error) {
          console.error('Ошибка при создании заказа:', error);
        } finally {
          setLoadingOrderCreate(false);
          navigate('/');
        }
    }


    useEffect(() =>{
        const fetchUserData = async () =>{
            try{
                const response = await axios.get(`${host}/auth/get_account_type/${user_id}`)
                setAccountType(response.data)
                console.log(response.data)
                setLoading(false)
            }
            catch (error){
                console.error(error)
            }
        }
        if(!logged_in){
            navigate('/auth')
        }
        else{
            if (loading){
                fetchUserData()
            }
        }
    })

    


    return(
        <div>
            <Header props={accountType}/>
            <div className="container mt-4">
              <h1 className="mb-4">Создать новый заказ</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Название заказа
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Описание
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Бюджет
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="deadline" className="form-label">
                    Сроки
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loadingOrderCreate}>
                  {loadingOrderCreate ? 'Создание...' : 'Создать заказ'}
                </button>

              </form>
            </div>
        </div>
    )
}

export default CreateOrderPage;