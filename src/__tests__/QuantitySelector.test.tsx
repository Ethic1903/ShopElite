import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantitySelector from '../components/QuantitySelector';

describe('QuantitySelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('должен отображать текущее количество', () => {
    render(
      <QuantitySelector 
        quantity={1} 
        onChange={mockOnChange}
        min={1}
        max={10}
      />
    );
    expect(screen.getByRole('spinbutton')).toHaveValue(1);
  });

  it('должен увеличивать количество при нажатии +', () => {
    render(
      <QuantitySelector 
        quantity={1} 
        onChange={mockOnChange}
        min={1}
        max={10}
      />
    );
    fireEvent.click(screen.getByText('+'));
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('должен уменьшать количество при нажатии -', () => {
    render(
      <QuantitySelector 
        quantity={2} 
        onChange={mockOnChange}
        min={1}
        max={10}
      />
    );
    fireEvent.click(screen.getByText('-'));
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('не должен уменьшать ниже минимума', () => {
    render(
      <QuantitySelector 
        quantity={1} 
        onChange={mockOnChange}
        min={1}
        max={10}
      />
    );
    fireEvent.click(screen.getByText('-'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('не должен увеличивать выше максимума', () => {
    render(
      <QuantitySelector 
        quantity={10} 
        onChange={mockOnChange}
        min={1}
        max={10}
      />
    );
    fireEvent.click(screen.getByText('+'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('должен обрабатывать прямой ввод значения', () => {
    render(
      <QuantitySelector 
        quantity={1} 
        onChange={mockOnChange}
        min={1}
        max={10}
      />
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });
    expect(mockOnChange).toHaveBeenCalledWith(5);
  });
});
