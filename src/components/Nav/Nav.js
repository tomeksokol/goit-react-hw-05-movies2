import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#fa7584' : '#fff' })} className={styles.link}>
        Strona Główna
      </NavLink>

      <NavLink to="/movies" style={({ isActive }) => ({ color: isActive ? '#fa7584' : '#fff' })} className={styles.link}>
        Wyszukiwarka
      </NavLink>
    </nav>
  )
}

export default Nav