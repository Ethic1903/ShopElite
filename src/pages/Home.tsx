import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  color: white;
  padding: var(--space-5) var(--space-3);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: var(--space-6);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
`;

const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--space-3);
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: var(--space-4);
  opacity: 0.9;
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: var(--color-primary-700);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: var(--space-4);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: var(--color-primary-500);
  }
`;

const CategoryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  text-decoration: none;
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const CategoryIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
`;

const CategoryName = styled.span`
  font-weight: 600;
  color: var(--color-gray-800);
`;

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-3);
`;

const FeaturedSection = styled.section`
  margin-top: var(--space-5);
`;

const ViewAllButton = styled(Link)`
  display: inline-block;
  background-color: var(--color-primary-500);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-base);
  margin-top: var(--space-4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Добро пожаловать в ShopElite</HeroTitle>
          <HeroSubtitle>
            Откройте для себя удивительную коллекцию качественных товаров по отличным ценам
          </HeroSubtitle>
          <HeroButton to="/products">Начать покупки</HeroButton>
        </HeroContent>
      </HeroSection>

      <FeaturedSection>
        <SectionTitle>Популярные товары</SectionTitle>
        <ProductGrid products={featuredProducts} loading={loading} />
        <ViewAllButton to="/products">Посмотреть все товары</ViewAllButton>
      </FeaturedSection>
    </HomeContainer>
  );
};

export default Home;