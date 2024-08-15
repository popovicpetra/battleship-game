import React from 'react'
import styles from './ShipsOptions.module.css'

import Ship from '../Ship/Ship'

const ShipsOptions = ({ isHorizontal, availableShips }) => {
  return (
    <div className={styles.shipsOptions}>
      {availableShips.map((ship) => (
        <Ship key={ship.id} id={ship.id} ship={ship}></Ship>
      ))}
    </div>
  )
}

export default ShipsOptions
