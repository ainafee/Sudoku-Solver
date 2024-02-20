# Sudoku Solver

This is a simple solver implemented in JavaScript that solves classic sudoku puzzles.

## The Algorithm

This sudoku solver was first implemented using a basic backtrack algorithm, and then eventually improved with
knowledge from one of my university courses called Introduction to Artificial Intelligence.

This project applies a backtrack algorithm, along with forward checking, and the following heuristics:
- Most constrained variable
- Most constraining variable
- Least constraining value

## User Interface

The UI for the project was implemented with React.js as a simple single page application.
Although the implementation is fairly robust, entering values is a bit tedious.

## Next Steps

User-friendly Inputs
- Implementing arrow key functionality
- Uploading an image to parse a puzzle