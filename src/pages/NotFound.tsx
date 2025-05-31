import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-5);
  min-height: 50vh;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-primary-500);
  margin-bottom: var(--space-3);
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: var(--space-3);
  color: var(--color-gray-800);
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--color-gray-600);
  max-width: 500px;
  margin-bottom: var(--space-4);
`;

const Container = styled(NotFoundContainer)`
  /* Additional styles if needed */
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  background-color: var(--color-primary-500);
  color: white;
  transition: all var(--transition-base);

  &:hover {
    background-color: var(--color-primary-600);
  }
`;

const NotFound: React.FC = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Страница не найдена</Title>
      <Description>
        Извините, страница, которую вы ищете, не существует или была перемещена.
      </Description>
      <HomeButton to="/">Вернуться на главную</HomeButton>
    </Container>
  );
};

export default NotFound;