import React from 'react'
import styles from './Button.module.css'

const Button = ({ text, fun }) => {
  return (
    <button className={styles.button} onClick={() => fun()}>
      {text}
    </button>
  )
}

export default Button
