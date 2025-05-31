import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';

const mockCategories = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing"
];

describe('CategoryFilter Component', () => {
  it('должен отображать все категории', () => {
    render(
      <BrowserRouter>
        <CategoryFilter categories={mockCategories} />
      </BrowserRouter>
    );

    expect(screen.getByText('Электроника')).toBeInTheDocument();
    expect(screen.getByText('Украшения')).toBeInTheDocument();
    expect(screen.getByText('Мужская одежда')).toBeInTheDocument();
    expect(screen.getByText('Женская одежда')).toBeInTheDocument();
  });

  it('должен подсвечивать активную категорию', () => {
    render(
      <BrowserRouter>
        <CategoryFilter categories={mockCategories} activeCategory="electronics" />
      </BrowserRouter>
    );
    
    const activeLink = screen.getByText('Электроника').closest('a');
    expect(activeLink).toHaveStyle({ backgroundColor: 'var(--color-primary-500)' });
  });
});
