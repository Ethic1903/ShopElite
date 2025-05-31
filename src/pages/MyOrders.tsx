import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');
    const userOrders = allOrders[user] || [];
    // Сортируем заказы по дате (новые сначала)
    userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(userOrders);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#fff', padding: 32, borderRadius: 8 }}>
      <h1>Мои заказы</h1>
      {orders.length === 0 ? (
        <p>У вас пока нет заказов.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatCurrency(order.total, 'RUB')}</td>
                <td>
                  {order.status === 'pending'
                    ? 'В обработке'
                    : order.status === 'processing'
                    ? 'Обрабатывается'
                    : order.status === 'shipped'
                    ? 'Отправлен'
                    : 'Доставлен'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
