import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CardListItem({ icon, children }) {
  return (
    <li>
      <FontAwesomeIcon icon={icon} /> {children}
    </li>
  );
}
