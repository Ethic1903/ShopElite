import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const BreadcrumbContainer = styled.nav`
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  
  &:last-child {
    color: var(--color-gray-700);
    font-weight: 500;
  }
  
  &::after {
    content: '/';
    margin-left: var(--space-1);
    color: var(--color-gray-400);
  }
  
  &:last-child::after {
    content: '';
    margin: 0;
  }
`;

const BreadcrumbLink = styled(Link)`
  color: var(--color-primary-500);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <BreadcrumbContainer aria-label="Breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.path ? (
              <BreadcrumbLink to={item.path}>{item.label}</BreadcrumbLink>
            ) : (
              <span>{item.label}</span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;