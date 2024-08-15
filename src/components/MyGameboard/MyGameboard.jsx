import React from 'react'
import styles from './MyGameboard.module.css'
import { useState, useRef, forwardRef } from 'react'

import MyField from '../MyField/MyField'

const MyGameboard = forwardRef((props, ref) => {
  const [currentlyPlacing, setCurrentlyPlacing] = useState('ce vidimo')

  return (
    <div className={styles.board} ref={ref}>
      {props.myBoard.map((row, columnIndex) => {
        return row.map((_, rowIndex) => (
          <MyField
            key={`cell_${rowIndex}_${columnIndex}`}
            id={`cell_${rowIndex}_${columnIndex}`}
          ></MyField>
        ))
      })}
    </div>
  )
})

export default MyGameboard
