import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const Card = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #f8f8f8;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const CardBody = styled.div`
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductCategory = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-1);
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: var(--space-2);
  /* Limit to two lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary-600);
  margin-top: auto;
  padding-top: var(--space-2);
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
`;

const AddToCartButton = styled.button`
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-base);
  flex: 1;
  
  &:hover {
    background-color: var(--color-primary-600);
  }
  
  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const ViewDetailsButton = styled(Link)`
  background-color: transparent;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all var(--transition-base);
  flex: 1;
  
  &:hover {
    background-color: var(--color-gray-100);
    color: var(--color-gray-900);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
`;

const Stars = styled.div`
  color: var(--color-warning-500);
  margin-right: var(--space-1);
  display: flex;
`;

const ReviewCount = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-500);
`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const renderStars = (rating: number) => {
    // Безопасно приводим к числу от 0 до 5
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <Stars>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`star-${i}`}>★</span>
        ))}
        {hasHalfStar && <span>★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-star-${i}`} style={{ color: 'var(--color-gray-300)' }}>★</span>
        ))}
      </Stars>
    );
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  // Исправление наличия: если поле inStock отсутствует, считаем товар в наличии
  const isInStock = typeof product.inStock === 'boolean' ? product.inStock : true;

  return (
    <Card>
      <ImageContainer>
        <ProductImage src={product.image} alt={product.name} />
      </ImageContainer>
      <CardBody>
        <ProductCategory>{product.category}</ProductCategory>
        <ProductName>{product.name}</ProductName>
        <RatingContainer>
          {renderStars(product.rating)}
          <ReviewCount>
            {typeof product.rating === 'number'
              ? `${product.rating.toFixed(1)} / 5`
              : '—'}
            {typeof product.reviews === 'number'
              ? ` (${product.reviews} отзывов)`
              : ''}
          </ReviewCount>
        </RatingContainer>
        <ProductPrice>{formatCurrency(product.price, 'RUB')}</ProductPrice>
        <ButtonsContainer>
          <AddToCartButton 
            onClick={handleAddToCart} 
            disabled={!isInStock}
          >
            {isInStock ? 'В корзину' : 'Нет в наличии'}
          </AddToCartButton>
        </ButtonsContainer>
      </CardBody>
    </Card>
  );
};

export default ProductCard;