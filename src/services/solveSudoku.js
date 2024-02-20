// DEPRECATED FILE; it's here mostly to keep a version of an older implementation
// This is a more naive approach to solving a sudoku which I initially came up with.
// For a better (and mainly faster) implementation check solveSudokuAI.js which makes
// use of a backtrack algorithm (similar to this file) but with forward checking, and
// a some simple heuristics that find the most constrained variable, the most constraining
// variable, and the least-constraining value.

const getSegments = (values) => {
    // get rows
    let rows = values;

    // get columns
    let columns = [];
    values.forEach((row) => {
        row.forEach((cell, index) => {
            if (columns[index]) {
                // append the cell to the given index
                columns[index].push(cell);
            } else {
                // append an array with a single value to columns
                columns.push([cell]);
            }
        })
    })
    
    // get squares
    let squares = [];
    values.forEach((row, rowIndex) => {
        row.forEach((cell, index) => {
            let adder = 0;

            if (rowIndex > 5) adder = 6;
            else if (rowIndex > 2) adder = 3;

            if (squares[Math.floor(index/3) + adder]) {
                // append the cell to the given index
                squares[Math.floor(index/3) + adder].push(cell);
            } else {
                // append an array with a single value to columns
                squares.push([cell]);
            }
        })
    })
    return { rows, columns, squares }
}

const checkValidation = (values) => {
    let valid = true;
    const { rows, columns, squares } = getSegments(values);

    // check rows
    rows.forEach((row) => {
        let rowHas = [];
        row.forEach((cell) => {
            if (cell === '') return;
            if (rowHas.includes(cell)) valid = false;
            else rowHas.push(cell);
        });
    });
    if (!valid) return valid;

    // check columns
    columns.forEach((column) => {
        let columnHas = [];
        column.forEach((cell) => {
            if (cell === '') return;
            if (columnHas.includes(cell)) valid = false;
            else columnHas.push(cell);
        });
    });
    if (!valid) return valid;

    // check subsquares
    squares.forEach((square) => {
        let sqaureHas = [];
        square.forEach((cell) => {
            if (cell === '') return;
            if (sqaureHas.includes(cell)) valid = false;
            else sqaureHas.push(cell);
        });
    });

    return valid;
}

const findEmptyCell = (values) => {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
            if (values[i][j] === '') return { row: i, col: j }
        }
    }
    return -1;
}

const solveSudoku = (values) => {
    if(checkValidation(values)) {
        // assume the grid is valid so far
        const emptyCell = findEmptyCell(values);
        if (emptyCell === -1) {
            // the grid is full and we are done with the sudoku
            // simply return the values
            return values;
        } else {
            // empty cell is an object containing a row and col property
            // which points to a empty spot in the grid.
            //
            // We should take this spot and fill it with any value and try to solve
            // the grid recursively.
            let options = Array.from({length: 9}, (_, index) => {
                return (index + 1).toString();
            });

            while(options.length > 0) {
                let modifiedValues = JSON.parse(JSON.stringify(values));
                modifiedValues[emptyCell.row][emptyCell.col] = options.shift();
                const solution = solveSudoku(modifiedValues);
                if (solution !== -1) {
                    // there is a valid solution for the given option
                    // the grid should be full as well so we will return the solution here
                    return solution;
                }
                // else we keep looping using a different option
            }
            // reaching here means that options is empty, i.e. there is nothing that could
            // fill the grid in the given position for it to be valid, thus we return -1.
            return -1;
        }
    } else {
        // grid is invalid, we will return -1
        return -1;
    }
};

export {
    checkValidation,
    solveSudoku,
};