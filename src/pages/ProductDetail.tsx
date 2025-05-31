import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import Breadcrumb from '../components/Breadcrumb';
import QuantitySelector from '../components/QuantitySelector';
import { formatCurrency, formatRating } from '../utils/formatters';

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImageContainer = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  box-shadow: var(--shadow-md);
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-2);
`;

const ProductTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: var(--space-3);
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-600);
  margin-bottom: var(--space-3);
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-3);
`;

const Stars = styled.div`
  color: var(--color-warning-500);
  margin-right: var(--space-2);
`;

const ProductDescription = styled.div`
  margin-bottom: var(--space-4);
  line-height: 1.6;
  color: var(--color-gray-700);
`;

const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  
  @media (min-width: 576px) {
    flex-direction: row;
    align-items: center;
  }
`;

const AddToCartButton = styled.button`
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-base);
  
  &:hover {
    background-color: var(--color-primary-600);
  }
  
  &:disabled {
    background-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const StockStatus = styled.div<{ inStock: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => props.inStock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.inStock ? 'var(--color-success-500)' : 'var(--color-error-500)'};
  margin-bottom: var(--space-3);
`;

const TabsContainer = styled.div`
  margin-top: var(--space-5);
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-gray-300);
  margin-bottom: var(--space-4);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: var(--space-3) var(--space-4);
  border: none;
  background-color: transparent;
  border-bottom: 2px solid ${props => props.active ? 'var(--color-primary-500)' : 'transparent'};
  color: ${props => props.active ? 'var(--color-primary-600)' : 'var(--color-gray-600)'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
  
  &:hover {
    color: var(--color-primary-500);
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: var(--space-4);
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
  
  &::before {
    content: '✓';
    color: var(--color-success-500);
    margin-right: var(--space-2);
    font-weight: bold;
  }
`;

const SpecificationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: var(--color-gray-100);
  }
`;

const TableCell = styled.td`
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-gray-200);
  
  &:first-child {
    font-weight: 500;
    width: 40%;
  }
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: var(--space-5);
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const productId = parseInt(id);
      const foundProduct = getProductById(productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // If product is not in context, try to fetch it directly
        import('../utils/api').then(({ api }) => {
          api.getProductById(productId).then(product => {
            if (product) {
              setProduct(product);
            }
          }).finally(() => {
            setLoading(false);
          });
        });
      }
      
      setLoading(false);
    }
  }, [id, getProductById]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${product.name} добавлен в корзину!`);
    }
  };
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <Stars>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`star-${i}`}>★</span>
        ))}
        {hasHalfStar && <span>★</span>}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <span key={`empty-star-${i}`} style={{ color: 'var(--color-gray-300)' }}>★</span>
        ))}
      </Stars>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <NotFoundContainer>
        <h2>Товар не найден</h2>
        <p>Товар, который вы ищете, не существует или был удален.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
          Просмотреть товары
        </button>
      </NotFoundContainer>
    );
  }
  
  // Create breadcrumb items
  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Товары', path: '/products' },
    { label: (() => {
      const translateCategory = (cat: string) => {
        const translations: { [key: string]: string } = {
          'electronics': 'Электроника',
          'jewelery': 'Украшения',
          "men's clothing": 'Мужская одежда',
          "women's clothing": 'Женская одежда'
        };
        return translations[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
      };
      return translateCategory(product.category);
    })(), path: `/products/${product.category}` },
    { label: product.name }
  ];
  
  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      
      <ProductContainer>
        <ImageContainer>
          <ProductImage src={product.image} alt={product.name} />
        </ImageContainer>
        
        <ProductInfo>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductRating>
            {renderStars(product.rating)}
            <span>({product.reviews} отзывов)</span>
          </ProductRating>
          <ProductPrice>{formatCurrency(product.price, 'RUB')}</ProductPrice>
          <StockStatus inStock={product.inStock}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </StockStatus>
          <ProductDescription>{product.description}</ProductDescription>

          <ProductActions>
            <QuantitySelector 
              quantity={quantity} 
              onChange={setQuantity} 
              max={10} 
              min={1} 
            />
            <AddToCartButton 
              onClick={handleAddToCart} 
              disabled={!product.inStock}
            >
              {product.inStock ? 'В корзину' : 'Нет в наличии'}
            </AddToCartButton>
          </ProductActions>
        </ProductInfo>
      </ProductContainer>

      <TabsContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'description'} 
            onClick={() => setActiveTab('description')}
          >
            Описание
          </TabButton>
          <TabButton 
            active={activeTab === 'features'} 
            onClick={() => setActiveTab('features')}
          >
            Особенности
          </TabButton>
          <TabButton 
            active={activeTab === 'specifications'} 
            onClick={() => setActiveTab('specifications')}
          >
            Характеристики
          </TabButton>
        </TabButtons>
        
        <TabContent>
          {activeTab === 'description' && (
            <div>
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'features' && (
            <div>
              <FeaturesList>
                {product.features?.map((feature, index) => (
                  <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
              </FeaturesList>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div>
              <SpecificationsTable>
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </SpecificationsTable>
            </div>
          )}
        </TabContent>
      </TabsContainer>
    </div>
  );
};

export default ProductDetail;