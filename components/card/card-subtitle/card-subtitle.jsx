import React from 'react';
import styles from './card-subtitle.module.scss';

export default function CardSubtitle({ children }) {
  return <p className={styles['index-card-subtitle']}>{children}</p>;
}
