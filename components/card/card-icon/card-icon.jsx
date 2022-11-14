import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './card-icon.module.scss';

export default function CardIcon({ icon }) {
  return (
    <figure className={styles['index-card-icon']}>
      <FontAwesomeIcon icon={icon} />
    </figure>
  );
}
