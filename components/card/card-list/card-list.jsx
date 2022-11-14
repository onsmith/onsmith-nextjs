import React from 'react';
import styles from './card-list.module.scss';

export default function CardList({ children }) {
  return <ul className={styles['index-section-list']}>{children}</ul>;
}
