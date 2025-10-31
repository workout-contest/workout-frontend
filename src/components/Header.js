import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../services/apiService';
import tokenManager from '../utils/tokenManager';

const HeaderContainer = styled.header`
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
`;

const LogoutButton = styled.button`
  font-family: var(--font-primary);
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const Logo = styled(Link)`
  font-family: var(--font-primary);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Header = ({ onLoginStateChange }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(tokenManager.isLoggedIn());

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsLoggedIn(false);
      // 로그아웃 시 App.js에 상태 변경 알림
      if (onLoginStateChange) {
        onLoginStateChange(false);
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 에러가 발생해도 로컬 상태는 업데이트
      setIsLoggedIn(false);
      if (onLoginStateChange) {
        onLoginStateChange(false);
      }
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">스텝포워드</Logo>

        {isLoggedIn && (
          <>
            <AuthButtons>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </AuthButtons>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
