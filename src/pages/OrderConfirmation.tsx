import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Order } from '../types';

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ConfirmationCard = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  animation: slideUp 0.5s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ThankYouMessage = styled.div`
  text-align: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-gray-200);
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-success-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-3);
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const OrderDetails = styled.div`
  margin-bottom: var(--space-4);
`;

const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderLabel = styled.span`
  font-weight: 500;
  color: var(--color-gray-600);
`;

const OrderValue = styled.span`
  font-weight: 600;
`;

const AddressCard = styled.div`
  padding: var(--space-3);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
`;

const OrderItems = styled.div`
  margin-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
  padding-top: var(--space-4);
`;

const OrderItem = styled.div`
  display: flex;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-gray-100);
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  margin-right: var(--space-3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: var(--space-1);
`;

const ItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-gray-600);
  font-size: 0.875rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-200);
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
  
  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  transition: all var(--transition-base);
`;

const PrimaryButton = styled(Button)`
  background-color: var(--color-primary-500);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-600);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  
  &:hover {
    background-color: var(--color-gray-100);
  }
`;

const OrderConfirmation: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Retrieve order information from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // Redirect to home if no order information is available
      navigate('/');
    }
  }, [navigate]);
  
  if (!order) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Заказ оформлен' }
  ];

  // orderTotal = order.total
  return (
    <ConfirmationContainer>
      <Breadcrumb items={breadcrumbItems} />

      <ConfirmationCard>
        <ThankYouMessage>
          <CheckIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </CheckIcon>
          <h2>Спасибо за заказ!</h2>
          <p>Ваш заказ успешно оформлен и передан в обработку.</p>
        </ThankYouMessage>

        <OrderDetails>
          <h3>Информация о заказе</h3>
          <OrderRow>
            <OrderLabel>№ заказа:</OrderLabel>
            <OrderValue>{order.id}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>Дата:</OrderLabel>
            <OrderValue>{formatDate(order.createdAt)}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>Способ оплаты:</OrderLabel>
            <OrderValue>{order.paymentMethod}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>Статус заказа:</OrderLabel>
            <OrderValue style={{ color: 'var(--color-success-500)' }}>
              {order.status === 'pending'
                ? 'В обработке'
                : order.status === 'processing'
                ? 'Обрабатывается'
                : order.status === 'shipped'
                ? 'Отправлен'
                : 'Доставлен'}
            </OrderValue>
          </OrderRow>
        </OrderDetails>
        <div>
          <h3>Адрес доставки</h3>
          <AddressCard>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </AddressCard>
        </div>
        <OrderItems>
          <h3>Товары</h3>
          {order.items.map((item, index) => (
            <OrderItem key={index}>
              <ItemImage>
                <img src={item.product.image} alt={item.product.name} />
              </ItemImage>
              <ItemDetails>
                <ItemName>{item.product.name}</ItemName>
                <ItemMeta>
                  <span>Кол-во: {item.quantity}</span>
                  <span>{formatCurrency(item.product.price * item.quantity, 'RUB')}</span>
                </ItemMeta>
              </ItemDetails>
            </OrderItem>
          ))}
          <TotalRow>
            <span>Итого:</span>
            <span>{formatCurrency(order.total, 'RUB')}</span>
          </TotalRow>
        </OrderItems>
      </ConfirmationCard>
      <ActionButtons>
        <PrimaryButton to="/products">Продолжить покупки</PrimaryButton>
        <SecondaryButton to="/">На главную</SecondaryButton>
      </ActionButtons>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation;