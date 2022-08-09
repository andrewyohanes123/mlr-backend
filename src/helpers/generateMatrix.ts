export const generateMatrixAn = (matrix: number[][], maxtrixH: number[], index: number): number[][] => {
  const generatedMatrix = matrix.map((item, idx )=> (
    item.map((val, id) => (id === index ? maxtrixH[idx] : val))
  ))

  return generatedMatrix;
}