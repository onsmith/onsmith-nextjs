import React from 'react';
import styles from './footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles['primary-footer']}>
      <p>Copyright &copy; {year} Aaron Smith</p>
    </footer>
  );
}
