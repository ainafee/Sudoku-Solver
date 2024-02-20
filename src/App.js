import React, { useState } from 'react';
import board from './models/initSquare';
import { checkValidation, solveSudoku } from './services/solveSudokuAI';
import SudokuBoard from './components/sudoku-board';

import './App.css';

const App = () => {

  const [values, setValues] = useState(board);

  const handleSolve = () => {
    const isValid = checkValidation(values);
    if (isValid) {
      const solution = solveSudoku(values);
      if (solution !== -1) setValues([...solution]);
      else alert('SUDOKU CANNOT BE SOLVED!!');
    } else {
      alert('SUDOKU GRID PROVIDED IS INVALID!!');
    }
  }

  return (
    <div className="App">
      <div style={{paddingTop: '10px' }}/>
      <div className='page-title'>SUDOKU SOLVER</div>
      <div className='page-subtitle'>CREATED BY AINAFEE MAKNOJIA</div>
      <SudokuBoard values={values} setValues={setValues} />
      <div style={{paddingTop: '30px' }}/>
      <button
        className='solve-button'
        onClick={() => handleSolve()}
      >
        Solve!
      </button>
    </div>
  );
}

export default App;
