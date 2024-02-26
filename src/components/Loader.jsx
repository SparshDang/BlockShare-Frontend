import React from 'react'

import style from './Loader.module.css';

export default function Loader() {
  return (
    <div className={style.overlay}>
        <div className={style.loader}></div>
    </div>
  )
}
