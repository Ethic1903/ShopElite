import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductProvider, useProducts } from '../context/ProductContext';

// Clear mock calls between tests
beforeEach(() => {
  jest.clearAllMocks();
});

const mockProducts = [
  {
    id: 1,
    title: 'Test Product', // Match the expected test value
    name: 'Test Product',  // Add name field
    price: 7499.99, // Realistic RUB price
    category: 'electronics',
    description: 'Test description',
    image: 'test.jpg',
    rating: 4.5,
    reviews: 10,
    inStock: true
  }
];

// Mock the API module
jest.mock('../utils/api', () => ({
  api: {
    getProducts: jest.fn().mockImplementation(() => {
      // Transform the response to match expected format
      return Promise.resolve(mockProducts.map(product => ({
        ...product,
        name: product.title // Ensure name field exists
      })));
    }),
    getCategories: jest.fn().mockResolvedValue(['electronics'])
  }
}));

const TestComponent = () => {
  const { products, loading } = useProducts();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="products-length">{products.length}</div>
      <div data-testid="product-by-id">
        {products.find(p => p.id === 1)?.name || 'not found'}
      </div>
    </div>
  );
};

describe('ProductContext', () => {
  it('должен находить продукт по id', async () => {
    render(
      <ProductProvider>
        <TestComponent />
      </ProductProvider>
    );

    // Wait for the products to load
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Verify the product is found
    expect(screen.getByTestId('product-by-id')).toHaveTextContent('Test Product');
    expect(screen.getByTestId('products-length')).toHaveTextContent('1');
  });
});
