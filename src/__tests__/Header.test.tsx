import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';
import Header from '../components/Header';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            {component}
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('должен отображать логотип', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('должен отображать поле поиска', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('должен отображать кнопку корзины', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('cart-button')).toBeInTheDocument();
  });

  it('должен переключать мобильное меню', () => {
    renderWithProviders(<Header />);
    const menuButton = screen.getByLabelText('Открыть меню');

    fireEvent.click(menuButton);
    expect(screen.getByLabelText('Закрыть меню')).toBeInTheDocument();
  });
});
