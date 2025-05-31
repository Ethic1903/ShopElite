import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import QuantitySelector from '../components/QuantitySelector';
import { formatCurrency } from '../utils/formatters';

const CartContainer = styled.div`
  min-height: 400px;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: var(--space-5);
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

const CartTable = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  
  @media (min-width: 768px) {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }
`;

const CartHeader = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: table-header-group;
  }
`;

const CartHeaderRow = styled.div`
  @media (min-width: 768px) {
    display: table-row;
  }
`;

const CartHeaderCell = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: table-cell;
    padding: var(--space-3);
    font-weight: 600;
    color: var(--color-gray-700);
    border-bottom: 2px solid var(--color-gray-200);
    text-align: left;
    
    &:last-child {
      text-align: right;
    }
  }
`;

const CartBody = styled.div`
  @media (min-width: 768px) {
    display: table-row-group;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  
  @media (min-width: 768px) {
    display: table-row;
    box-shadow: none;
    background-color: transparent;
    border-radius: 0;
  }
`;

const CartCell = styled.div`
  @media (min-width: 768px) {
    display: table-cell;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-gray-200);
    vertical-align: middle;
  }
`;

const ProductImageContainer = styled.div`
  width: 80px;
  height: 80px;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ProductInfo = styled.div`
  grid-column: 2;
  
  @media (min-width: 768px) {
    display: table-cell;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-gray-200);
  }
`;

const ProductName = styled.h3`
  font-size: 1rem;
  margin-bottom: var(--space-1);
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: var(--color-primary-600);
  
  @media (min-width: 768px) {
    display: table-cell;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-gray-200);
    text-align: center;
  }
`;

const QuantityContainer = styled.div`
  margin-top: var(--space-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (min-width: 768px) {
    display: table-cell;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-gray-200);
    text-align: center;
    margin-top: 0;
  }
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  margin-top: var(--space-2);
  
  @media (min-width: 768px) {
    display: table-cell;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-gray-200);
    text-align: right;
    margin-top: 0;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--color-gray-500);
  cursor: pointer;
  transition: color var(--transition-base);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  
  &:hover {
    color: var(--color-error-500);
  }
`;

const CartSummary = styled.div`
  margin-top: var(--space-4);
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-4);
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

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--transition-base);
  margin-top: var(--space-4);
  
  &:hover {
    background-color: var(--color-primary-600);
  }
  
  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const ContinueShoppingLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: var(--color-primary-500);
  text-decoration: none;
  margin-top: var(--space-3);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: var(--space-1);
  }
`;

const Cart: React.FC = () => {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  
  // Fixed shipping cost for demonstration purposes
  const shippingCost = 0; // убираем доставку
  const taxRate = 0; // убираем налог
  const taxAmount = 0;
  const orderTotal = totalPrice;

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Корзина' }
  ];
  
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };
  
  return (
    <CartContainer>
      <Breadcrumb items={breadcrumbItems} />
      <h1>Ваша корзина</h1>
      
      {items.length === 0 ? (
        <EmptyCartMessage>
          <h2>Ваша корзина пуста</h2>
          <p>Похоже, вы еще не добавили товары в корзину.</p>
          <ContinueShoppingLink to="/products">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Продолжить покупки
          </ContinueShoppingLink>
        </EmptyCartMessage>
      ) : (
        <>
          <CartTable>
            <CartHeader>
              <CartHeaderRow>
                <CartHeaderCell>Товар</CartHeaderCell>
                <CartHeaderCell>Цена</CartHeaderCell>
                <CartHeaderCell>Количество</CartHeaderCell>
                <CartHeaderCell>Итого</CartHeaderCell>
              </CartHeaderRow>
            </CartHeader>
            <CartBody>
              {items.map(item => (
                <CartItem key={item.product.id}>
                  <CartCell>
                    <ProductImageContainer>
                      <ProductImage src={item.product.image} alt={item.product.name} />
                    </ProductImageContainer>
                  </CartCell>
                  <ProductInfo>
                    <ProductName>{item.product.name}</ProductName>
                    <div className="mobile-only" style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)' }}>
                      {item.product.category}
                    </div>
                  </ProductInfo>
                  <ProductPrice>
                    {formatCurrency(item.product.price, 'RUB')}
                  </ProductPrice>
                  <QuantityContainer>
                    <div className="mobile-label" style={{ fontWeight: 500 }}>Количество:</div>
                    <QuantitySelector 
                      quantity={item.quantity} 
                      onChange={(quantity) => handleQuantityChange(item.product.id, quantity)} 
                      max={10}
                    />
                    <RemoveButton onClick={() => handleRemoveItem(item.product.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </RemoveButton>
                  </QuantityContainer>
                  <TotalContainer>
                    <div className="mobile-label" style={{ fontWeight: 500 }}>Итого:</div>
                    {formatCurrency(item.product.price * item.quantity, 'RUB')}
                  </TotalContainer>
                </CartItem>
              ))}
            </CartBody>
          </CartTable>
          
          <CartSummary>
            <h3>Ваш заказ</h3>
            <SummaryRow>
              <span>Сумма</span>
              <span>{formatCurrency(totalPrice, 'RUB')}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Итого</span>
              <span>{formatCurrency(orderTotal, 'RUB')}</span>
            </SummaryRow>
            
            <CheckoutButton to="/checkout">
              Оформить заказ
            </CheckoutButton>
            
            <ContinueShoppingLink to="/products">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Продолжить покупки
            </ContinueShoppingLink>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
};

export default Cart;