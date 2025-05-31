import React from 'react';
import styled from 'styled-components';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  overflow: hidden;
  width: fit-content;
`;

const Button = styled.button`
  background-color: var(--color-gray-100);
  border: none;
  color: var(--color-gray-800);
  width: 32px;
  height: 32px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-base);
  
  &:hover {
    background-color: var(--color-gray-200);
  }
  
  &:disabled {
    cursor: not-allowed;
    color: var(--color-gray-400);
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 32px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--color-gray-300);
  border-right: 1px solid var(--color-gray-300);
  font-size: 0.875rem;
  -moz-appearance: textfield;
  
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    margin: 0;
  }
`;

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onChange, 
  max = 99, 
  min = 1 
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };
  
  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onChange(value);
    }
  };
  
  return (
    <Container>
      <Button 
        onClick={handleDecrease} 
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        -
      </Button>
      <QuantityInput 
        type="number" 
        min={min} 
        max={max} 
        value={quantity} 
        onChange={handleChange}
        aria-label="Quantity"
      />
      <Button 
        onClick={handleIncrease} 
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </Container>
  );
};

export default QuantitySelector;