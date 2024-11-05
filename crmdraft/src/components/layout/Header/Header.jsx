import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Package, Warehouse, Users, Settings } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>CRM System</h1>
        </div>
        
        <nav className="desktop-nav">
          <NavLink to="/orders" className="nav-link">
            <ShoppingCart size={20} />
            <span>Заказы</span>
          </NavLink>
          <NavLink to="/products" className="nav-link">
            <Package size={20} />
            <span>Товары</span>
          </NavLink>
          <NavLink to="/inventory" className="nav-link">
            <Warehouse size={20} />
            <span>Склад</span>
          </NavLink>
          <NavLink to="/clients" className="nav-link">
            <Users size={20} />
            <span>Клиенты</span>
          </NavLink>
          <NavLink to="/settings/shops" className="nav-link">
            <Settings size={20} />
            <span>Настройки</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header; 