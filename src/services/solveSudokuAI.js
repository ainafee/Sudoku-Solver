// This file makes use of basic AI prinicples of a backtrack algorithm with forward
// checking and heuristics, including the most constrained variable, the most constraining
// variable, and the least-constraining value. This is a faster version of the older
// (and more naive) implementation found in the solveSudoku.js file. However, the older version
// is easier to understand and follow for someone not familiar with the methods described above.

// random variable order as a one dimension index value
let randomVars = [];

// boolean array checking if random var is placed or not
let varPlaced = [];

// assignment
let assignment = null;

// fc stack
let fc = [];

// helper function for checkValidation below
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

// simple function that checks whether the sudoku is valid or not
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

// helper function for solveSudoku which changes the input to the
// match the desired format
const formatValues = (values) => {
    return values.map((row) => {
        return row.map((value) => {
            return value === "" ? null : parseInt(value)
        })
    });
}

// Fisher-Yates (aka Knuth) Shuffle algorithm
const shuffle = (arr) => {
    let rand;
    let index = arr.length;

    while (index) {
        rand = Math.floor(Math.random() * index)
        index--;

        [arr[index], arr[rand]] = [arr[rand], arr[index]];
    }

    return arr;
}

// determine which cells need to be filled
const allocateOpenSlots = () => {
    // doing this to reset the global variable between runs
    randomVars = [];
    varPlaced = [];

    // iterate through the assignment array to determine which cells are empty
    assignment.forEach((row, rowIndex) => {
        row.forEach((cell, index) => {
            if (cell === null) {
                randomVars.push(9 * rowIndex + index);
                varPlaced.push(false);
            }
        })
    })
}

// initialize the fc (forward checking) stack
const initFC = () => {
    fc.push([]);
    randomVars.forEach((variable) => {
        const row = Math.floor(variable / 9);
        const col = variable % 9;
        let legalValues = [];
        [1,2,3,4,5,6,7,8,9].forEach((i) => {
            // check row
            if (assignment[row].includes(i)) return;
            // check col
            for (let j = 0; j < 9; j++) {
                if(assignment[j][col] === i) return;
            }
            // check subsquare
            const rowStart = 3 * Math.floor(row / 3);
            const colStart = 3 * Math.floor(col / 3);
            for (let j = rowStart; j < rowStart + 3; j++) {
                for (let k = colStart; k < colStart + 3; k++) {
                    if(assignment[j][k] === i) return;
                }
            }
            // reaching this point means the number wasn't found so it can be legal
            legalValues.push(i);
        })
        fc[0].push(legalValues);
    })
}

// converts a one dimensional position into a row and column
const selectUnassignedVar = (posn) => {
    const value = randomVars[posn];
    return {
        row: Math.floor(value / 9),
        col: value % 9
    }
}

// checks if posn "sees" the coordinates of (targetRow, targetCol)
// esentially returns true if the two points can't have the same value
const isAdjacent = (posn, targetRow, targetCol) => {
    if (posn.row === targetRow) return true;
    if (posn.col === targetCol) return true;
    const rowStart = 3 * Math.floor(posn.row / 3);
    const colStart = 3 * Math.floor(posn.col / 3);
    if (targetRow >= rowStart && targetRow < rowStart + 3 && targetCol >= colStart && targetCol < colStart + 3) return true;
    return false;
}

// checks if the assignment is consistent with the new value being added at (row, col)
// If so, then does the forward check and returns true if the check succeeds and updates the assignment
const isConsistent = (value, row, col, posn) => {
    // check row
    if (assignment[row].includes(value)) return false;
    // check column
    for (let i = 0; i < 9; i++) {
        if(assignment[i][col] === value) return false;
    }
    // check subsquare
    const rowStart = 3 * Math.floor(row / 3);
    const colStart = 3 * Math.floor(col / 3);
    for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
            if(assignment[i][j] === value) return false;
        }        
    }
    // at this point the placement should be consistent, do forward checking
    let newEntry = JSON.parse(JSON.stringify(fc[fc.length - 1]));
    newEntry[posn] = [value];

    for (let i = 0; i < newEntry.length; i++) {
        if (!varPlaced[i] && i !== posn && isAdjacent(selectUnassignedVar(i), row, col)) {
            if ((newEntry[i].length === 1) && (newEntry[i][0] === value)) return false;
            else if (newEntry[i].includes(value)) newEntry[i].splice(newEntry[i].indexOf(value), 1);
        }
    }

    // forward checking did not fail, so value can be assigned and new entry can be added to fc stack
    fc.push(newEntry);
    assignment[row][col] = value
    varPlaced[posn] = true;
    return true;
}

// checks if the current assignment has no empty (null) slots left
const isComplete = () => {
    for (let i = 0; i < assignment.length; i++) {
        for (let j = 0; j < assignment[i].length; j++) {
            if (!assignment[i][j]) return false;
        }
    }
    return true;
}

// finds the next variable choice given the most constrained variable
// and the most constraining variable heuristics
const findNextPosnWithHeuristic = () => {
    // Most constrained Variable
    let result = randomVars.map((variable, index) => {
        return { variable, index }
    });
    result = result.filter((_, index) => !varPlaced[index]);

    let minOptions = 10;
    fc[fc.length - 1].forEach((options, index) => {
        if (varPlaced[index]) return;
        if(options.length < minOptions) minOptions = options.length;
    })

    let notMConstrained = [];

    fc[fc.length - 1].forEach((options, index) => {
        if (varPlaced[index]) return;
        if(options.length > minOptions) notMConstrained.push(index);
    })

    result = result.filter((value) => !notMConstrained.includes(value.index));

    // at this point result has a list of most constrained variables
    if (result.length === 1) return result[0].index;

    // there are at least 2 items in result list -> look for most constraining variable
    const constraining = result.map((value) => {
        const { row, col } = selectUnassignedVar(value.index);
        let count = 0;
        // open spots in row
        assignment[row].forEach((cell, index) => {
            if(index !== col && !cell) count++;
        })
        // open spots in col
        for (let i = 0; i < 9; i++) {
            if(i !== row && !assignment[i][col]) count++;
        }
        // open spots in subsquare
        const rowStart = 3 * Math.floor(row / 3);
        const colStart = 3 * Math.floor(col / 3);
        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = colStart; j < colStart + 3; j++) {
                if(i !== row && j !== col && !assignment[i][j]) count++;
            }        
        }
        return count;
    })

    let maxCount = 0;
    constraining.forEach((count) => {
        if(count > maxCount) maxCount = count;
    })

    result = result.filter((_, index) => {
        return constraining[index] === maxCount
    })

    // at this point result has a list of most constraining variables
    return shuffle(result)[0].index;
}

// Finds an ordering of value choices for the variable at (row, col) given
// the least-constraining value heuristic
const findValueOrderByHeuristic = (row, col) => {
    const posn = row * 9 + col;
    let newEntry = fc[fc.length - 1];

    // compute how many rule outs each of the choices will cause
    let ruleOuts = [1,2,3,4,5,6,7,8,9].map((value) => {
        let count = 0;
        for (let i = 0; i < newEntry.length; i++) {
            if (!varPlaced[i] && i !== posn && isAdjacent(selectUnassignedVar(i), row, col)) {
                if (newEntry[i].includes(value)) count++;
            }
        }
        return {value, count};
    })

    // sort from lowest to highest rule outs
    ruleOuts.sort((a,b) => a.count - b.count);

    // the following randomizes the order of the choices with the same number of rule outs
    // this happens with the tempArr and then, once randomized it is added to the final result
    let tempArr = [];
    let result = [];

    tempArr.push(ruleOuts.shift());
    while (ruleOuts.length > 0) {
        if (tempArr.length === 0) tempArr.push(ruleOuts.shift());
        else if (tempArr[0].count === ruleOuts[0].count) tempArr.push(ruleOuts.shift());
        else {
            result = [...result, ...shuffle(tempArr)];
            tempArr = [ruleOuts.shift()];
        }
    }
    result = [...result, ...shuffle(tempArr)];

    // only need to return the value, caller does not need to know the count of the rule outs
    return result.map((item) => item.value);
}

// recurssive backtrack function call with forward checking and heuristics
const recurssive_heuristic_backtrack = (posn) => {
    if (isComplete()) return assignment
    const { row, col } = selectUnassignedVar(posn);
    const values = findValueOrderByHeuristic(row, col);

    for (let i = 0; i < values.length; i++) {
        if (isConsistent(values[i], row, col, posn)) {
            if (isComplete()) return assignment;
            const result = recurssive_heuristic_backtrack(findNextPosnWithHeuristic());
            if (result !== -1) return result;
            assignment[row][col] = null;
            varPlaced[posn] = false;
            fc.pop();
        }
    }
    return -1;
}

// helper function to check if the grid is already full, in which case there is no need to try and solve
const isFull = (assignment) => {
    for (const row of assignment) {
        for (const value of row) {
            if (!value) return false;
        }
    }
    return true;
}

// main function to solve the sudoku
const solveSudoku = (values) => {
    // reinitialize for multiple solves
    randomVars = [];
    varPlaced = [];
    assignment = null;
    fc = [];

    // deep copy for multiple solves
    assignment = JSON.parse(JSON.stringify(formatValues(values)));

    if (isFull(assignment)) {
        return assignment
    }

    allocateOpenSlots();
    initFC();
    return recurssive_heuristic_backtrack(findNextPosnWithHeuristic());
}

export {
    checkValidation,
    solveSudoku
};