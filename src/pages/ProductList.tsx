import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import Breadcrumb from '../components/Breadcrumb';
import { Product } from '../types';

const ProductListContainer = styled.div`
  min-height: 600px;
`;

const SearchHeading = styled.h2`
  margin-bottom: var(--space-4);
  font-size: 1.5rem;
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-3);
`;

const SortSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  background-color: white;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
  }
`;

const ProductList: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const { products, categories, loading } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>('featured');

  // Get search query from URL if it exists
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    let result = [...products];
    
    // Apply category filter if specified
    if (category && category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result = sortProducts(result, sortOption);
    
    setFilteredProducts(result);
  }, [products, category, searchQuery, sortOption]);

  const sortProducts = (productsToSort: Product[], option: string): Product[] => {
    const sortedProducts = [...productsToSort];
    
    switch (option) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'rating':
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        // Featured is a combination of rating and recency, we'll simulate this with rating
        return sortedProducts.sort((a, b) => b.rating - a.rating);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  // Determine the page title based on category or search
  const getPageTitle = () => {
    if (searchQuery) {
      return `Результаты поиска для "${searchQuery}"`;
    }
    
    if (category) {
      const translateCategory = (cat: string) => {
        const translations: { [key: string]: string } = {
          'electronics': 'Электроника',
          'jewelery': 'Украшения',
          "men's clothing": 'Мужская одежда',
          "women's clothing": 'Женская одежда'
        };
        return translations[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
      };
      
      return category === 'all' 
        ? 'Все товары' 
        : translateCategory(category);
    }
    
    return 'Все товары';
  };

  // Create breadcrumb items
  const breadcrumbItems = searchQuery
    ? [
        { label: 'Главная', path: '/' },
        { label: 'Результаты поиска' }
      ]
    : [
        { label: 'Главная', path: '/' },
        { label: category ? getPageTitle() : 'Все товары' }
      ];

  return (
    <ProductListContainer>
      <Breadcrumb items={breadcrumbItems} />

      {searchQuery ? (
        <SearchHeading>
          Результаты поиска по "{searchQuery}" ({filteredProducts.length} товаров найдено)
        </SearchHeading>
      ) : (
        <h1>{getPageTitle()}</h1>
      )}

      <CategoryFilter categories={categories} activeCategory={category} />

      <SortContainer>
        <SortSelect value={sortOption} onChange={handleSortChange}>
          <option value="featured">Популярные</option>
          <option value="price-low">Сначала дешевые</option>
          <option value="price-high">Сначала дорогие</option>
          <option value="rating">По рейтингу</option>
          <option value="name">По названию</option>
        </SortSelect>
      </SortContainer>

      <ProductGrid products={filteredProducts} loading={loading} />
    </ProductListContainer>
  );
};

export default ProductList;