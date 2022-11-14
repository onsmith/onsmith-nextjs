import React from 'react';
import styles from './card-text.module.scss';

export default function CardText({ children }) {
  return <p className={styles['info-card-text']}>{children}</p>;
}
