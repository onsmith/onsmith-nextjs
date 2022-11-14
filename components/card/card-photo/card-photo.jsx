import React from 'react';
import Image from 'next/image'
import styles from './card-photo.module.scss';

export default function CardPhoto() {
  return (
    <Image
      className={styles['info-card-photo']}
      src="/headshot.png"
      alt="A photo of Aaron Smith"
      height="300"
      width="300"
    />
  );
}
