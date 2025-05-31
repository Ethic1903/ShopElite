import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--space-4);
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid var(--color-gray-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spinner 1s ease-in-out infinite;
  
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-5) 0;
  width: 100%;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--color-gray-700);
  margin-bottom: var(--space-2);
`;

const EmptyText = styled.p`
  color: var(--color-gray-500);
  max-width: 500px;
  margin: 0 auto;
`;

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading = false }) => {
  if (loading) {
    return (
      <LoadingContainer>
        <Spinner data-testid="loading-spinner" />
      </LoadingContainer>
    );
  }
  
  if (products.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>Товары не найдены</EmptyTitle>
        <EmptyText>
          Не удалось найти товары по вашему запросу. Попробуйте изменить фильтры или поисковую фразу.
        </EmptyText>
      </EmptyState>
    );
  }
  
  return (
    <Grid>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};

export default ProductGrid;