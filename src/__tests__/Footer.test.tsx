import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  it('должен отображать основную информацию', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    const logo = screen.getAllByText(/ShopElite/i)[0];
    expect(logo).toBeInTheDocument();
    expect(screen.getByText(/© 2023/i)).toBeInTheDocument();
  });
});
