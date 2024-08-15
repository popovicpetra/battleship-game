export const hasEnoughBlocksToDeploy = (
  isHorizontal,
  shipLength,
  rowIndex,
  columnIndex
) => {
  return isHorizontal
    ? Number(shipLength) + Number(rowIndex) > 10
      ? false
      : true
    : Number(shipLength) + Number(columnIndex) > 10
    ? false
    : true
}

export const isBlockFree = (myBoard, rowIndex, columnIndex) => {
  console.log('leeej')
  console.log(myBoard)
  if (myBoard[rowIndex][columnIndex] != null) return false
  else return true
}

export const areBlocksFree = (
  myBoard,
  isHorizontal,
  shipLength,
  rowIndex,
  columnIndex
) => {
  if (isHorizontal) {
    for (let i = 0; i < Number(shipLength); i++) {
      const newColumn = Number(columnIndex) + Number(i)
      if (!isBlockFree(myBoard, Number(rowIndex), newColumn)) {
        return false
      }
    }
  } else {
    for (let i = 0; i < Number(shipLength); i++) {
      const newRow = Number(rowIndex) + Number(i)
      if (!isBlockFree(myBoard, newRow, Number(columnIndex))) {
        return false
      }
    }
  }

  return true
}
