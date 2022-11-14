import React from 'react';
import styles from './info-card.module.scss';

export default function InfoCard({ children }) {
  return <section className={styles['card-body']}>{children}</section>;
}
