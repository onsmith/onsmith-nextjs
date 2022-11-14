import React from 'react';
import styles from './card-title.module.scss';

export default function CardTitle({ children }) {
  return <h2 className={styles['index-card-title']}>{children}</h2>;
}
