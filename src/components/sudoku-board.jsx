import React from "react";
import Cell from "./cell";

import '../styles/sudoku-board.css';

const SudokuBoard = ({ values, setValues }) => {

  const validNum = (stringNum) => {
    if (stringNum === '') return true;
    const num = parseInt(stringNum, 10);
    if (isNaN(num)) {
      return false;
    }
    if (num > 0 && num < 10) {
      return true;
    }
    return false;
  };

  const setCell = (e, row, column) => {
    if (validNum(e.target.value)) {
      let updatedValues = values;
      updatedValues[row][column] = e.target.value;
      setValues([...updatedValues]);
    } else setValues([...values]);
  };

  return (
    <table id="grid" border="1" align="center">
      <tbody>
        {
          values.map((row, index) => {
            return (
              <tr className="row" key={`ROW ${index}`}>
                {row.map((cell, rowIndex) => {
                  return (
                    <Cell 
                      key={rowIndex}
                      rowIndex={rowIndex}
                      cell={cell}
                      setCell={setCell}
                      row={index}
                    />
                  );
                })}
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}

export default SudokuBoard;
