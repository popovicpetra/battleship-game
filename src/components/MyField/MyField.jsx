import React from 'react'
import styles from './MyField.module.css'

const MyField = ({ id, handleDragOver, handleOnDrop }) => {
  // const style = {
  //   backgroundColor:
  // }
  return (
    <div
      id={id}
      className={styles.field}
      onDragOver={handleDragOver}
      onDrop={handleOnDrop}
    ></div>
  )
}

export default MyField
