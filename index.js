/*
GAME INSTRUCTIONS:
- 10x10 grid
- 1x Battleship (5 squares)
- 2x Destroyers (4 squares)
- Place a number of ships on the grid at random
- The player enters coordinates of the form “A5”, where "A" is the column and "5" is the row, to specify a square to target.
- Shots result in hits, misses or sinks. The game ends when all ships are sunk.
*/

const setUp = {
  rows: 10,
  cols: 10,
  letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
  battleship: 5,
  destroyer: 4,
  shipWidth: 1,
  white: '#ffffff',
  gray: '#bababa',
  red: '#ff0000',
  gameOver: false,
  shipsSunk: 0,
  ships: [
    { locations: [], hits: 0, isSunk: false },
    { locations: [], hits: 0, isSunk: false },
    { locations: [], hits: 0, isSunk: false }
  ],
  gameContainer: document.getElementById('game'),
  form: document.getElementById('form'),
  colList: document.getElementById('columns'),
  rowList: document.getElementById('rows'),
  userCoords: document.getElementById('coords'),
  resetBtn: document.getElementsByClassName('reset')[0],
  errorMsg: document.getElementsByClassName('error')[0],

  // make the grid columns and rows and nav elements
  buildGrid: () => {
    for (let i = 0; i < setUp.cols; i++) {
      // columns
      let colItem = document.createElement('li')
      setUp.colList.appendChild(colItem)
      colItem.innerText = i + 1;

      // rows
      let rowItem = document.createElement('li')
      setUp.rowList.appendChild(rowItem)
      rowItem.innerText = setUp.letters[i];

      for (let j = 0; j < setUp.rows; j++) {
        let square = document.createElement('div');
        setUp.gameContainer.appendChild(square);
        // unique id based on its row and column, e.g. "A1"
        square.id = setUp.letters[i] + (j + 1);
      }
    }
  },

  // put ships on the grid
  setShips: () => {
    let locations;
    for (let i = 0; i < 3; i++) {
      do {
        locations = setUp.buildShip(i);
      } while (setUp.avoidOverlap(locations));

      setUp.ships[i].locations = locations;
    }
  },

  // randomly create 3 ships, 2 battleships and 1 destory
  buildShip: (i) => {
    let direction = Math.floor(Math.random() * 2);
    let row, col;
    let size = i % 2 ? setUp.battleship : setUp.destroyer;

    if (direction === 1) {
      row = setUp.letters[Math.floor(Math.random() * setUp.shipWidth)];
      col = Math.floor(Math.random() * (setUp.shipWidth + size));
    } else {
      row = Math.floor(Math.random() * (setUp.shipWidth + size))
      col = Math.floor(Math.random() * size);
    }

    let newShipLocations = [];
    for (let i = 0; i < size; i++) {
      if (direction === 1) {
        newShipLocations.push(`${row}${(col + i + 1)}`);
      } else {
        newShipLocations.push(`${setUp.letters[row + i]}${(col + 1)}`);
      }
    }

    // add classes for styling purposes
    for (let i = 0; i < newShipLocations.length; i++) {
      let square = document.getElementById(newShipLocations[i])
      if (square) {
        square.classList.add('ship')
      }
    }

    return newShipLocations;
  },

  // check to make sure randomly placed ships don't overlap
  avoidOverlap: (locations) => {
    for (let i = 0; i < setUp.ships.length; i++) {
      let ship = setUp.ships[i];
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
}

// handle the hits and sinks
const handleHit = (val) => {
  for (let i = 0; i < setUp.ships.length; i++) {
    let ship = setUp.ships[i];

    if (ship.locations.indexOf(val) >= 0) {
      ship.hits++;

      if (ship.hits === ship.locations.length) {
        ship.isSunk = true;
        setUp.shipsSunk++;
      }
    }
  }
  console.log(setUp.shipsSunk, 'how many sunk?')
  if (setUp.shipsSunk === 3) {
    setUp.gameOver = true;
  }
}


// error handling:
// false coordinates
// existing hit
const submitForm = (e) => {
  e.preventDefault()
  let error = '';
  let result = setUp.userCoords.value; // get value
  setUp.userCoords.value = ''; // reset form after submit

  if (result.length > 1 && result.length < 4) {
    let square = document.getElementById(result.toLowerCase())

    if (square) {
      handleHit(result.toLowerCase())
      if (square.classList.contains('hit')) {
        error = 'This has already been hit!';
      } else {
        square.classList.add('hit')
        error = '';
      }
    } else {
      error = 'Please enter valid coordinates.';
    }
  } else {
    error = 'Please enter valid coordinates.';
  }

  if (setUp.gameOver) {
    error = 'All ships sunk! Game over.'
  }

  setUp.errorMsg.innerText = error;
}

// const reset = () => {
//   setUp.gameOver = false;
//   setUp.shipsSunk = 0;
//   setUp.ships = [
//     { locations: [], hits: 0, isSunk: false },
//     { locations: [], hits: 0, isSunk: false },
//     { locations: [], hits: 0, isSunk: false }
//   ];

//   setUp.setShips();
// }

// initialize !
const init = () => {
  // add event listener to form for submissions and validation
  form.addEventListener('submit', submitForm, false);
  form.focus();

  // add event listener for game reset
  // setUp.resetBtn.addEventListener('click', reset, false);

  setUp.buildGrid();
  setUp.setShips();
}

init();