import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';

const stripePromise = Promise.resolve(null);

describe('PaymentForm Component', () => {
  it('должен отображать сумму к оплате', () => {
    render(
      <Elements stripe={stripePromise}>
        <PaymentForm
          amount={99999}
          onPaymentSuccess={() => {}}
          onPaymentError={() => {}}
          isProcessing={false}
          setIsProcessing={() => {}}
        />
      </Elements>
    );
    
    expect(screen.getByText(/99 999/)).toBeInTheDocument();
  });

  it('должен блокировать кнопку во время обработки', () => {
    render(
      <Elements stripe={stripePromise}>
        <PaymentForm
          amount={99999}
          onPaymentSuccess={() => {}}
          onPaymentError={() => {}}
          isProcessing={true}
          setIsProcessing={() => {}}
        />
      </Elements>
    );
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Оплата...')).toBeInTheDocument();
  });
});
