import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import { formatCurrency } from '../utils/formatters';
import { api } from '../utils/api';
import { CheckoutFormData } from '../types';

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);

  @media (min-width: 992px) {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const CheckoutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const CheckoutForm = styled.form`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
`;

const FormTitle = styled.h3`
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-gray-200);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-3);

  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: var(--space-3);
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--space-1);
  font-weight: 500;
  color: var(--color-gray-700);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-family: inherit;
  font-size: 1rem;
  transition: border-color var(--transition-base);

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const PaymentButton = styled.button`
  width: 100%;
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-base);
  margin-top: var(--space-3);

  &:hover {
    background-color: var(--color-primary-600);
  }

  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
  position: sticky;
  top: var(--space-4);
`;

const SummaryTitle = styled.h3`
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-gray-200);
`;

const OrderItem = styled.div`
  display: flex;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
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

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);

  &:last-of-type {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-gray-200);
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error-500);
  font-size: 0.875rem;
  margin-top: var(--space-1);
`;

const SuccessMessage = styled.div`
  background-color: rgba(16, 185, 129, 0.1);
  border-left: 4px solid var(--color-success-500);
  color: var(--color-success-500);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
`;

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Россия'
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const orderTotal = totalPrice;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name as keyof CheckoutFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<CheckoutFormData> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'ФИО обязательно';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email некорректен';
    }

    if (!formData.address.trim()) {
      errors.address = 'Адрес обязателен';
    }

    if (!formData.city.trim()) {
      errors.city = 'Город обязателен';
    }

    if (!formData.state.trim()) {
      errors.state = 'Регион обязателен';
    }

    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Почтовый индекс обязателен';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Имитация обработки заказа
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const order = await api.createOrder({
        items,
        total: orderTotal,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: 'Наличные при получении'
      });

      localStorage.setItem('lastOrder', JSON.stringify(order));
      setPaymentSuccess(true);
      
      // Очищаем корзину
      clearCart();

      setTimeout(() => {
        navigate('/order-confirmation');
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Корзина', path: '/cart' },
    { label: 'Оформление заказа' }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <h1>Оформление заказа</h1>
      {paymentSuccess && (
        <SuccessMessage>
          Заказ успешно оформлен! Перенаправляем на страницу подтверждения...
        </SuccessMessage>
      )}
      <CheckoutContainer>
        <CheckoutContent>
          <CheckoutForm onSubmit={handleOrderSubmit}>
            <FormTitle>Данные для доставки</FormTitle>

            <FormGroup>
              <Label htmlFor="fullName">ФИО</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Введите ваше ФИО"
              />
              {formErrors.fullName && <ErrorMessage>{formErrors.fullName}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите ваш email"
              />
              {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="address">Адрес</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Введите ваш адрес"
              />
              {formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="city">Город</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Город"
                />
                {formErrors.city && <ErrorMessage>{formErrors.city}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="state">Регион</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Регион"
                />
                {formErrors.state && <ErrorMessage>{formErrors.state}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="postalCode">Почтовый индекс</Label>
                <Input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Почтовый индекс"
                />
                {formErrors.postalCode && <ErrorMessage>{formErrors.postalCode}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="country">Страна</Label>
                <Input
                  id="country"
                  name="country"
                  value="Россия"
                  disabled
                  readOnly
                />
              </FormGroup>
            </FormRow>

            <PaymentButton type="submit" disabled={isProcessing}>
              {isProcessing ? 'Оформляем заказ...' : 'Оформить заказ'}
            </PaymentButton>
          </CheckoutForm>
        </CheckoutContent>

        <OrderSummary>
          <SummaryTitle>Ваш заказ</SummaryTitle>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 'var(--space-3)' }}>
            {items.map(item => (
              <OrderItem key={item.product.id}>
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
          </div>
          <SummaryRow>
            <span>Сумма</span>
            <span>{formatCurrency(totalPrice, 'RUB')}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Итого</span>
            <span>{formatCurrency(orderTotal, 'RUB')}</span>
          </SummaryRow>
        </OrderSummary>
      </CheckoutContainer>
    </div>
  );
};

export default Checkout;