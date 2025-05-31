import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';

const RegisterContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) var(--space-2);
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-5);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease-out;

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

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: var(--space-4);
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-600);
  margin-bottom: var(--space-2);
`;

const Subtitle = styled.p`
  color: var(--color-gray-600);
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-gray-700);
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: 1rem;
 
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: var(--color-gray-400);
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 4px solid var(--color-error-500);
  color: var(--color-error-600);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin-bottom: var(--space-3);
`;

const SubmitButton = styled.button`
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color var(--transition-base);

  &:hover {
    background-color: var(--color-primary-600);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: var(--space-4) 0;
  position: relative;
  color: var(--color-gray-500);
  font-size: 0.875rem;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--color-gray-300);
    z-index: 1;
  }

  span {
    background-color: white;
    padding: 0 var(--space-3);
    position: relative;
    z-index: 2;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  color: var(--color-gray-600);
  font-size: 0.875rem;

  a {
    color: var(--color-primary-500);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Введите корректный email');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!register(email, password)) {
      setError('Пользователь с таким email уже существует');
      return;
    }

    navigate('/');
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Регистрация' }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <RegisterContainer>
        <RegisterCard>
          <LogoContainer>
            <Logo>ShopElite</Logo>
            <Subtitle>Создайте новый аккаунт</Subtitle>
          </LogoContainer>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Пароль</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль (минимум 6 символов)"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Подтвердите пароль"
                required
              />
            </FormGroup>

            <SubmitButton type="submit">
              Зарегистрироваться
            </SubmitButton>
          </Form>

          <Divider>
            <span>или</span>
          </Divider>

          <LoginLink>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </LoginLink>
        </RegisterCard>
      </RegisterContainer>
    </div>
  );
};

export default Register;
