import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

interface CategoryFilterProps {
  categories: string[];
  activeCategory?: string;
}

const FilterContainer = styled.div`
  margin-bottom: var(--space-4);
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: var(--space-2);
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const FilterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
`;

const FilterList = styled.div`
  display: inline-flex;
  gap: var(--space-2);
`;

const FilterItem = styled.div`
  display: inline-block;
`;

const FilterLink = styled(Link)<{ $active: boolean }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: ${props => props.$active ? 'var(--color-primary-500)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--color-gray-700)'};
  border: 1px solid ${props => props.$active ? 'var(--color-primary-500)' : 'var(--color-gray-300)'};
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--color-primary-600)' : 'var(--color-gray-100)'};
  }
`;

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory }) => {
  const translateCategory = (category: string) => {
    const translations: { [key: string]: string } = {
      'electronics': 'Электроника',
      'jewelery': 'Украшения',
      "men's clothing": 'Мужская одежда',
      "women's clothing": 'Женская одежда'
    };
    return translations[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <FilterContainer>
      <FilterTitle>Категории</FilterTitle>
      <FilterList>
        <FilterItem>
          <FilterLink 
            to="/products" 
            $active={!activeCategory || activeCategory === 'all'}
          >
            Все товары
          </FilterLink>
        </FilterItem>
        {categories.map(category => (
          <FilterItem key={category}>
            <FilterLink 
              to={`/products/${category}`}
              $active={activeCategory === category}
            >
              {translateCategory(category)}
            </FilterLink>
          </FilterItem>
        ))}
      </FilterList>
    </FilterContainer>
  );
};

export default CategoryFilter;