import React from "react";

const Cell = ({rowIndex, cell, setCell, row}) => {
    return (
        <td className="cell" key={`CELL ${row} ${rowIndex}`}>
          <input
            type="text"
            maxLength="1"
            value={cell}
            onChange={(e) => setCell(e, row, rowIndex)}
          />
        </td>
    );
}

export default Cell;