import React from 'react';
import styles from './MyGameboard.module.css';

import MyField from '../MyField/MyField';

const MyGameboard = (props) => {
  return (
    <div className={styles.board}>
      {props.myBoard.map((row, rowIndex) => {
        return row.map((_, columnIndex) => (
          <MyField
            key={`cell_${rowIndex}_${columnIndex}`}
            id={`cell_${rowIndex}_${columnIndex}`}
            ship={props.myBoard[rowIndex][columnIndex]}
            handleOnDrop={props.handleOnDrop}
            handleDragOver={props.handleDragOver}
          ></MyField>
        ));
      })}
    </div>
  );
};

export default MyGameboard;
