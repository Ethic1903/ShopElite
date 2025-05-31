import React, { useState } from 'react';
import styled from 'styled-components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatCurrency } from '../utils/formatters';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const FormContainer = styled.form`
  margin-top: var(--space-4);
`;

const CardContainer = styled.div`
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background-color: white;
  margin-bottom: var(--space-4);
  transition: border-color var(--transition-base);
  
  &:focus-within {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button<{ $isProcessing: boolean }>`
  width: 100%;
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: ${props => props.$isProcessing ? 'not-allowed' : 'pointer'};
  transition: background-color var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.$isProcessing ? 'var(--color-primary-500)' : 'var(--color-primary-600)'};
  }
  
  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-error-500);
  margin-top: var(--space-2);
  font-size: 0.875rem;
`;

const PaymentDetails = styled.div`
  margin-bottom: var(--space-3);
  padding: var(--space-3);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
`;

const PaymentAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
  margin-right: var(--space-2);
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
};

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing,
  setIsProcessing
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        throw error;
      }
      
      onPaymentSuccess(paymentMethod.id);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An unexpected error occurred');
      onPaymentError(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Удаляем все autocomplete с формы и CardElement
  return (
    <FormContainer onSubmit={handleSubmit} autoComplete="off">
      <PaymentDetails>
        <PaymentAmount>Сумма к оплате: {formatCurrency(amount, 'RUB')}</PaymentAmount>
        <p>Вы будете списаны на эту сумму после подтверждения оплаты.</p>
      </PaymentDetails>
      <label htmlFor="card-element">Банковская карта</label>
      <CardContainer>
        <CardElement id="card-element" options={cardElementOptions} />
      </CardContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SubmitButton 
        type="submit" 
        disabled={!stripe || isProcessing} 
        $isProcessing={isProcessing}
      >
        {isProcessing ? (
          <>
            <Spinner /> Оплата...
          </>
        ) : (
          'Оплатить'
        )}
      </SubmitButton>
    </FormContainer>
  );
};

export default PaymentForm;