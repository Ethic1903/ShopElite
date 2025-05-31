import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--color-gray-800);
  color: var(--color-gray-300);
  padding: var(--space-5) var(--space-3);
  margin-top: var(--space-6);
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const FooterTitle = styled.h4`
  color: white;
  margin-bottom: var(--space-2);
  font-size: 1.1rem;
`;

const FooterLink = styled(Link)`
  color: var(--color-gray-400);
  text-decoration: none;
  transition: color var(--transition-base);
  
  &:hover {
    color: white;
  }
`;

const ExternalLink = styled.a`
  color: var(--color-gray-400);
  text-decoration: none;
  transition: color var(--transition-base);
  
  &:hover {
    color: white;
  }
`;

const FooterBottom = styled.div`
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-700);
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-gray-500);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
`;

const SocialIcon = styled.a`
  color: var(--color-gray-400);
  transition: color var(--transition-base);
  
  &:hover {
    color: white;
  }
`;

const FooterText = styled.p`
  margin: 0;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>ShopElite</FooterTitle>
          <FooterText>
            Ваш надежный интернет-магазин с широким ассортиментом качественных товаров.
          </FooterText>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Быстрые ссылки</FooterTitle>
          <FooterLink to="/">Главная</FooterLink>
          <FooterLink to="/products">Товары</FooterLink>
          <FooterLink to="/cart">Корзина</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Категории</FooterTitle>
          <FooterLink to="/products/electronics">Электроника</FooterLink>
          <FooterLink to="/products/jewelery">Украшения</FooterLink>
          <FooterLink to="/products/men's clothing">Мужская одежда</FooterLink>
          <FooterLink to="/products/women's clothing">Женская одежда</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Поддержка</FooterTitle>
          <FooterText>Email: support@shopelite.com</FooterText>
          <FooterText>Телефон: +7 (800) 123-45-67</FooterText>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <FooterText>© 2023 ShopElite. Все права защищены.</FooterText>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;