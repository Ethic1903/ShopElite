import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';

const mockItems = [
  { label: 'Главная', path: '/' },
  { label: 'Категория', path: '/category' },
  { label: 'Товар' }
];

describe('Breadcrumb Component', () => {
  it('должен отображать все элементы хлебных крошек', () => {
    render(
      <BrowserRouter>
        <Breadcrumb items={mockItems} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByText('Товар')).toBeInTheDocument();
  });

  it('последний элемент не должен быть ссылкой', () => {
    render(
      <BrowserRouter>
        <Breadcrumb items={mockItems} />
      </BrowserRouter>
    );
    
    const lastItem = screen.getByText('Товар');
    expect(lastItem.closest('a')).toBeNull();
  });

  it('все элементы кроме последнего должны быть ссылками', () => {
    render(
      <BrowserRouter>
        <Breadcrumb items={mockItems} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Главная').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Категория').closest('a')).toHaveAttribute('href', '/category');
  });
});
