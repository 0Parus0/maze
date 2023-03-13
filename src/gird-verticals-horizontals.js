/* eslint-disable no-plusplus */
// Maze generation

// Number of rows and columns = cells
export const cellsHorizontal = 6;
export const cellsVertical = 4;
// Grid layout
export const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

// Vertical lines in side the maze

export const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));

// Horizontal lines inside the maze
export const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

// Randomly shuffling the neighbors for different mazes

export function shuffle(arr) {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        // const temp = arr[counter];
        // arr[counter] = arr[index];
        // arr[index] = temp;
        [arr[counter], arr[index]] = [arr[index], arr[counter]];
    }
    return arr;
}

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

export function stepThroughCell(row, column) {
    // If I have visited the cell at[row, column], then return
    if (grid[row][column]) return;
    // Mark this cell as being visited
    grid[row][column] = true;

    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
        // neighbor right above
        [row - 1, column, 'up'],
        // neighbor right below
        [row + 1, column, 'down'],
        // neighbor to the right
        [row, column + 1, 'right'],
        // neighbor to the left
        [row, column - 1, 'left'],
    ]);
    // For each neighbor
    for (const neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        // See if that neighbor is out bounds
        if (
            nextRow < 0 ||
            nextRow >= cellsVertical ||
            nextColumn < 0 ||
            nextColumn >= cellsHorizontal
        )
            // eslint-disable-next-line no-continue
            continue;

        // If we have visited that neighbor, continue to next neighbor
        // eslint-disable-next-line no-continue
        if (grid[nextRow][nextColumn]) continue;
        // Remove a wall from either horizontals or verticals
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }
        stepThroughCell(nextRow, nextColumn);
    }

    // Visit next cell
}
stepThroughCell(startRow, startColumn);
// console.log(grid, verticals, horizontals);
