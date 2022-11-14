import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './card-contact-list.module.scss';

export default function CardContactListItem({ href, icon, children = null }) {
  return (
    <li className={styles['card-contact-icon']}>
      <a href={href} target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={icon} />
        {children}
      </a>
    </li>
  );
}
