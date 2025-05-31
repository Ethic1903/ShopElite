import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductGrid from '../components/ProductGrid';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';

const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 99.99,
    description: "Description 1",
    category: "electronics",
    image: "test1.jpg",
    rating: 4.5,
    reviews: 10,
    inStock: true
  },
  {
    id: 2,
    name: "Product 2",
    price: 149.99,
    description: "Description 2",
    category: "electronics",
    image: "test2.jpg",
    rating: 4.0,
    reviews: 15,
    inStock: true
  }
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('ProductGrid Component', () => {
  it('должен отображать все продукты', () => {
    renderWithProviders(<ProductGrid products={mockProducts} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('должен показывать сообщение, когда продуктов нет', () => {
    renderWithProviders(<ProductGrid products={[]} />);
    expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
  });

  it('должен показывать спиннер при загрузке', () => {
    renderWithProviders(<ProductGrid products={[]} loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
