import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';

const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 99999,
  description: "Test Description",
  category: "electronics",
  image: "test.jpg",
  rating: 4.5,
  reviews: 10,
  inStock: true
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  it('должен отображать название продукта', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('должен отображать цену в правильном формате', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/99 999/)).toBeInTheDocument();
  });

  it('должен отображать кнопку "В корзину" если товар в наличии', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('В корзину')).toBeInTheDocument();
  });

  it('должен отображать "Нет в наличии" если товара нет в наличии', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Нет в наличии')).toBeInTheDocument();
  });

  it('должен отображать рейтинг и количество отзывов', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/4\.5 \/ 5/)).toBeInTheDocument();
    expect(screen.getByText(/10 отзывов/)).toBeInTheDocument();
  });

  it('должен отображать информацию о товаре', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(/99 999/)).toBeInTheDocument();
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/10 отзывов/)).toBeInTheDocument();
  });

  it('должен отображать актуальный статус наличия', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Нет в наличии')).toBeInTheDocument();
  });

  it('должен иметь рабочую кнопку добавления в корзину', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const addToCartButton = screen.getByText('В корзину');
    expect(addToCartButton).not.toBeDisabled();
    fireEvent.click(addToCartButton);
  });
});
