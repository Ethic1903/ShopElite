import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: var(--shadow-md);
  position:
  z-index: 100;
  transition: all var(--transition-base);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: 1280px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-600);
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-right: 2rem; // добавлен отступ справа
  &:hover {
    color: var(--color-primary-500);
  }
`;

const Nav = styled.nav`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
`;

const MobileNav = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 200;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  padding: 2rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: var(--color-gray-700);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  
  &:hover {
    color: var(--color-primary-500);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: var(--color-primary-500);
    transition: width var(--transition-base);
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-700);
  text-decoration: none;
  aria-label: "Корзина";
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-primary-500);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-right: 1rem;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 20px;
  font-size: 0.875rem;
  transition: all var(--transition-base);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-gray-700);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();
  const { categories } = useProducts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  // Функция для перехода по ссылке и закрытия меню
  const handleNavLink = (to: string) => {
    setIsMenuOpen(false);
    navigate(to);
  };

  return (
    <HeaderContainer style={{ 
      backgroundColor: isScrolled ? 'white' : 'rgba(255, 255, 255, 0.95)',
      boxShadow: isScrolled ? 'var(--shadow-md)' : 'none'
    }}>
      <HeaderContent>
        <Logo to="/" onClick={() => setIsMenuOpen(false)} data-testid="logo">
          <span>ShopElite</span>
        </Logo>
        
        <Nav>
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/products">Все товары</NavLink>
          {categories.slice(0, 3).map(category => {
            const translateCategory = (cat: string) => {
              const translations: { [key: string]: string } = {
                'electronics': 'Электроника',
                'jewelery': 'Украшения',
                "men's clothing": 'Мужская одежда',
                "women's clothing": 'Женская одежда'
              };
              return translations[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
            };
            
            return (
              <NavLink key={category} to={`/products/${category}`}>
                {translateCategory(category)}
              </NavLink>
            );
          })}
          {user && (
            <NavLink to="/my-orders">Мои заказы</NavLink>
          )}
        </Nav>
        
        <div className="flex items-center" style={{ gap: 16 }}>
          <form onSubmit={handleSearchSubmit}>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="search-input"
              />
            </SearchContainer>
          </form>
          
          <CartButton to="/cart" onClick={() => setIsMenuOpen(false)} data-testid="cart-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
          </CartButton>

          {user ? (
            <>
              <span style={{ marginLeft: 8, color: 'var(--color-primary-600)', fontWeight: 500 }}>
                {user}
              </span>
              <button
                style={{
                  marginLeft: 8,
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-error-500)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <NavLink to="/login" style={{ marginLeft: 8 }} onClick={() => setIsMenuOpen(false)}>
              Войти
            </NavLink>
          )}

          <MobileMenuButton 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </MobileMenuButton>
        </div>
      </HeaderContent>
      
      {/* Мобильное меню */}
      <MobileNav $isOpen={isMenuOpen}>
        <MobileNavHeader>
          <Logo to="/" onClick={() => setIsMenuOpen(false)}>
            ShopElite
          </Logo>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Закрыть меню">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </MobileNavHeader>
        <form
          onSubmit={handleSearchSubmit}
          className="mb-4"
          autoComplete="off"
        >
          <SearchInput
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
        </form>
        <MobileNavLinks>
          <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Главная</NavLink>
          <NavLink to="/products" onClick={() => setIsMenuOpen(false)}>Все товары</NavLink>
          {categories.map(category => {
            const translateCategory = (cat: string) => {
              const translations: { [key: string]: string } = {
                'electronics': 'Электроника',
                'jewelery': 'Украшения',
                "men's clothing": 'Мужская одежда',
                "women's clothing": 'Женская одежда'
              };
              return translations[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
            };
            
            return (
              <NavLink
                key={category}
                to={`/products/${category}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {translateCategory(category)}
              </NavLink>
            );
          })}
          {user && (
            <NavLink to="/my-orders" onClick={() => setIsMenuOpen(false)}>
              Мои заказы
            </NavLink>
          )}
          {!user ? (
            <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
              Войти
            </NavLink>
          ) : (
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-error-500)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
            >
              Выйти
            </button>
          )}
        </MobileNavLinks>
      </MobileNav>
    </HeaderContainer>
  );
};

export default Header;