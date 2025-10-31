import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: var(--bg-primary);
  color: var(--text-muted);
  padding: var(--spacing-lg);
  text-align: center;
  margin-top: auto;
  border-top: 1px solid var(--border-light);
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 400;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
    font-size: 0.85rem;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 스텝포워드. 모든 권리 보유.</p>
    </FooterContainer>
  );
};

export default Footer;
