import Header from "../header";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import host from "../../api";

const ExchangePage = (props) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [responseText, setResponseText] = useState('');
    const user_id = JSON.parse(localStorage.getItem('user_id'))

    useEffect(() => {
        const fetchOrders = async () => {
          try {

            const response = await axios.get(`${host}/order/orders/?page=1&page_size=10`);
            setOrders(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
            setLoading(false);
          }
        };
        if(loading)
            fetchOrders();
    });

    const handleApply = (orderId) => {

    };


    return (
        <div>
            <Header props={props.props}/>
            <h1>Биржа</h1>
              {loading ? (
                <p>Загрузка...</p>
              ) : (
            <ul>
              {orders.map((order) => (

                <li key={order.order_id} className="list-group-item bg-light mb-2">
                  <h3>{order.title}</h3>
                  <p>Описание: {order.description}</p>
                  <p>Бюджет: {order.price} рублей</p>

                  <p>Сроки: {order.time} дней</p>
                  <Link to={`/response/${order.order_id}`} className="btn btn-primary">
                    Откликнуться
                  </Link>

                </li>
              ))}
            </ul>
          )}
        </div>
    )
}

export default ExchangePage