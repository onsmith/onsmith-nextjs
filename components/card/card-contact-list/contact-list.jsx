import React from 'react';
import styles from './card-contact-list.module.scss';

export default function CardContactList({ children }) {
  return <ul className={styles['card-contact-list']}>{children}</ul>;
}
