import {Component} from '@angular/core';
import {Cell} from './models/cell';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private is2D: boolean;
  private exists2D = true;
  private isWrap: boolean;
  private hoodType: number;
  private learnMethod: number;
  private radius: number;
  public matrixWidth = 4;
  private netSize: number;
  private matrixSize: number;
  private s1percent: number;
  private s2percent: number;
  private s3percent: number;
  private s4percent: number;

  public genNum = 0;
  public s1count = 0;
  public s2count = 0;
  public s3count = 0;
  public s4count = 0;
  public s1countpercent = 0;
  public s2countpercent = 0;
  public s3countpercent = 0;
  public s4countpercent = 0;
  public cellTotal = 0;
  public showSettings = true;
  public showHelp = false;

  private strategy = [];

  private gameGrid = [];

  private cellSize: string;
  private color1 = 'chartreuse';
  private color2 = 'indigo';
  private color3 = 'orange';
  private color4 = 'deeppink';


  // onGenerate: executed when network is created
  onGenerate(game) {
    this.genNum = 1;
    this.isWrap = (game.wrap === true);
    this.is2D = ((game.network === '2D') || (game.network === ''));
    // for hoodType: Von Neumann = 0, Moore (8) = 1, Moore (24) = 2
    switch (game.hoodType) {
      case 'vn': this.hoodType = 0; break;
      case 'moore8': this.hoodType = 1; break;
      case 'moore24': this.hoodType = 2; break;
      default: this.hoodType = 1; break;
    }
    // for learnMethod: Imitate the best = 0, myopic best response = 1, probabilistic imitate
    switch (game.learnMethod) {
      case 'itb': this.learnMethod = 0; break;
      case 'mbr': this.learnMethod = 1; break;
      case 'pi': this.learnMethod = 2; break;
      default: this.learnMethod = 0; break;
    }
    // this.radius = game.radius === '' ? 1 : parseInt(game.radius, 10);
    this.netSize = game.netSize === '' ? 20 : parseInt(game.netSize, 10);
    this.cellSize = game.cellSize === '' ? '10px' : game.cellSize.concat('px');
    this.matrixWidth = game.matrixWidth === '' ? 4 : parseInt(game.matrixWidth, 10);
    if (game.cell4 === '') {
      if (game.cell3 === '') {
        this.matrixSize = 2;
      } else {
        this.matrixSize = 3;
      }
    } else {
      this.matrixSize = 4;
    }

    switch (this.matrixSize) {
      case 2: {
        this.s1percent = game.s1percent === '' ? 50 : parseInt(game.s1percent, 10);
        this.s2percent = game.s2percent === '' ? 50 : parseInt(game.s2percent, 10);
        this.s3percent = 0;
        this.s4percent = 0;

        this.strategy[1] = [parseInt(game.cell1, 10), parseInt(game.cell2, 10)];
        this.strategy[2] = [parseInt(game.cell5, 10), parseInt(game.cell6, 10)];
        break;
      }
      case 3: {
        this.s1percent = game.s1percent === '' ? 33 : parseInt(game.s1percent, 10);
        this.s2percent = game.s2percent === '' ? 33 : parseInt(game.s2percent, 10);
        this.s3percent = game.s3percent === '' ? 34 : parseInt(game.s3percent, 10);
        this.s4percent = 0;

        this.strategy[1] = [parseInt(game.cell1, 10), parseInt(game.cell2, 10), parseInt(game.cell3, 10)];
        this.strategy[2] = [parseInt(game.cell5, 10), parseInt(game.cell6, 10), parseInt(game.cell7, 10)];
        this.strategy[3] = [parseInt(game.cell9, 10), parseInt(game.cell10, 10), parseInt(game.cell11, 10)];
        break;
      }
      case 4: {
        this.s1percent = game.s1percent === '' ? 25 : parseInt(game.s1percent, 10);
        this.s2percent = game.s2percent === '' ? 25 : parseInt(game.s2percent, 10);
        this.s3percent = game.s3percent === '' ? 25 : parseInt(game.s3percent, 10);
        this.s4percent = game.s4percent === '' ? 25 : parseInt(game.s4percent, 10);

        this.strategy[1] = [parseInt(game.cell1, 10), parseInt(game.cell2, 10), parseInt(game.cell3, 10), parseInt(game.cell4, 10)];
        this.strategy[2] = [parseInt(game.cell5, 10), parseInt(game.cell6, 10), parseInt(game.cell7, 10), parseInt(game.cell8, 10)];
        this.strategy[3] = [parseInt(game.cell9, 10), parseInt(game.cell10, 10), parseInt(game.cell11, 10), parseInt(game.cell12, 10)];
        this.strategy[4] = [parseInt(game.cell13, 10), parseInt(game.cell14, 10), parseInt(game.cell15, 10), parseInt(game.cell16, 10)];
        break;
      }
      default: {
        this.s1percent = game.s1percent === '' ? 25 : parseInt(game.s1percent, 10);
        this.s2percent = game.s2percent === '' ? 25 : parseInt(game.s2percent, 10);
        this.s3percent = game.s3percent === '' ? 25 : parseInt(game.s3percent, 10);
        this.s4percent = game.s4percent === '' ? 25 : parseInt(game.s4percent, 10);

        this.strategy[1] = [parseInt(game.cell1, 10), parseInt(game.cell2, 10), parseInt(game.cell3, 10), parseInt(game.cell4, 10)];
        this.strategy[2] = [parseInt(game.cell5, 10), parseInt(game.cell6, 10), parseInt(game.cell7, 10), parseInt(game.cell8, 10)];
        this.strategy[3] = [parseInt(game.cell9, 10), parseInt(game.cell10, 10), parseInt(game.cell11, 10), parseInt(game.cell12, 10)];
        this.strategy[4] = [parseInt(game.cell13, 10), parseInt(game.cell14, 10), parseInt(game.cell15, 10), parseInt(game.cell16, 10)];
        break;
      }
    }



    this.is2D ? this.gen2DGame() : this.gen1DGame();

  }

// gen2DGame: generates a 2D grid of cells for game
  gen2DGame() {
    const game = [];
    this.exists2D = true;
    for (let i = 0; i < this.netSize; i++) {
      game.push([]);
      game[i].push(new Array(this.netSize));
      for (let j = 0; j < this.netSize; j++) {
        game[i][j] = this.getCell();
      }
    }
    this.draw2DGame(game);
  }

// Renders the 2D Network as an HTML table
  draw2DGame(game) {
    document.getElementById('main').innerHTML = '';
    const net = document.createElement('table');
    net.setAttribute('id', 'grid');
    for (let i = 0; i < game.length; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < game.length; j++) {
        const cell = this.getCellStyle(game[i][j].strategy);
        tr.appendChild(cell);
      }
      net.appendChild(tr);
    }
    document.getElementById('main').appendChild(net);
    this.gameGrid = game;
    this.getPlayerCounts();
  }

// gen1DGame: Generates a 1D line of cells for game
  gen1DGame() {
    const game = [];
    this.exists2D = false;
    for (let i = 0; i < this.netSize; i++) {
      game.push(this.getCell());
    }
    // game is a 1D array of Cells (which has a strategy and payoff)
    this.draw1DGame(game, true);

  }

// Renders the network as an HTML table with a single row
  draw1DGame(game, eraseOld: boolean) {
    if (eraseOld) {
      document.getElementById('main').innerHTML = '';
    }
    const net = document.createElement('table');
    net.setAttribute('id', 'grid');
    const tr = document.createElement('tr');
    for (let i = 0; i < this.netSize; i++) {
      const cell = this.getCellStyle(game[i].strategy);
      tr.appendChild(cell);
    }
    net.appendChild(tr);
    document.getElementById('main').appendChild(net);
    this.gameGrid = game;
    this.getPlayerCounts();
  }

  getCellStyle(strat: number) {
    const cell = document.createElement('td');
    cell.style.borderWidth = '1px';
    cell.style.width = this.cellSize;
    cell.style.height = this.cellSize;
    switch (strat) {
      case 1: {
        cell.style.backgroundColor = this.color1;
        return cell;
      }
      case 2: {
        cell.style.backgroundColor = this.color2;
        return cell;
      }
      case 3: {
        cell.style.backgroundColor = this.color3;
        return cell;
      }
      case 4: {
        cell.style.backgroundColor = this.color4;
        return cell;
      }
    }
  }

// Returns a cell randomly generated based on given probabilities
  getCell() {
    const r = Math.random() * 100;
    switch (this.matrixSize) {
      case 2: {
        if (r <= this.s1percent) {
          return new Cell(1, 0);
        } else {
          return new Cell(2, 0);
        }
      }
      case 3: {
        const s2p = this.s1percent + this.s2percent;
        if (r <= this.s1percent) {
          return new Cell(1, 0);
        } else if (r <= s2p) {
          return new Cell(2, 0);
        } else {
          return new Cell(3, 0);
        }
      }
      case 4: {
        const s2p = this.s1percent + this.s2percent;
        const s3p = s2p + this.s3percent;
        if (r <= this.s1percent) {
          return new Cell(1, 0);
        } else if (r <= s2p) {
          return new Cell(2, 0);
        } else if (r <= s3p) {
          return new Cell(3, 0);
        } else {
          return new Cell(4, 0);
        }
      }
    }
  }

// nextGen: executed when next generation button is pressed
  nextGen() {
    this.genNum += 1;
    if (this.gameGrid.length === 0) {
      // No network has been created yet
      alert('Generate a network first!');
    } else {
      if (this.is2D) {
        this.next2DGen();
      } else {
        this.next1DGen();
      }
    }
  }



  // Iterates the generation for 2D networks
  next2DGen() {
    const tempGame1 = [];
    const tempGame2 = [];
    for (let i = 0; i < this.netSize; i++) {
      tempGame1.push([]);
      tempGame1[i].push(new Array(this.netSize));
      for (let j = 0; j < this.netSize; j++) {
        tempGame1[i][j] = this.get2DPayoffCell(this.gameGrid[i][j], i, j);
      }
    }

    for (let k = 0; k < this.netSize; k++) {
      tempGame2.push([]);
      tempGame2[k].push(new Array(this.netSize));
      for (let g = 0; g < this.netSize; g++) {
        tempGame2[k][g] = this.learn2DCellFitness(tempGame1, k, g);
      }
    }
    this.gameGrid = tempGame2;
    this.draw2DGame(this.gameGrid);
    }

  // returns the given cell with its appropriate payoff calculated (based on those around it)
  get2DPayoffCell(cell: Cell, row: number, col: number) {
    // row is row, column is col
    const pay = new Array(8);
    const edge = this.netSize - 1;
    const myStrategy = this.strategy[cell.strategy];

    // top middle cell (relative)
    if (row === 0) {
      // at the top of grid
      this.isWrap ? pay[0] = myStrategy[(this.gameGrid[edge][col].strategy) - 1] : pay[0] = 0;
    } else {
      // not at top of grid
      pay[0] = myStrategy[(this.gameGrid[row - 1][col].strategy) - 1];
    }

    // right cell (relative)
    if (col === edge) {
      // on right edge of grid
      this.isWrap ? pay[1] = myStrategy[(this.gameGrid[row][0].strategy) - 1] : pay[1] = 0;
    } else {
      // not on right edge of grid
      pay[1] = myStrategy[(this.gameGrid[row][col + 1].strategy) - 1];
    }

    // bottom cell (relative)
    if (row === edge) {
      // on bottom of grid
      this.isWrap ? pay[2] = myStrategy[(this.gameGrid[0][col].strategy) - 1] : pay[2] = 0;
    } else {
      // not on bottom of grid
      pay[2] = myStrategy[(this.gameGrid[row + 1][col].strategy) - 1];
    }

    // left cell (relative)
    if (col === 0) {
      // on left edge of grid
      this.isWrap ? pay[3] = myStrategy[(this.gameGrid[row][edge].strategy) - 1] : pay[3] = 0;
    } else {
      // not on left edge of grid
      pay[3] = myStrategy[(this.gameGrid[row][col - 1].strategy) - 1];
    }

    if (this.hoodType === 0) {
      // Von Neumann neighborhood, so we do not play against the corner cells
      return new Cell(cell.strategy, pay[0] + pay[1] + pay[2] + pay[3]);
    } else {
      // Moore neighborhood (8) so we play against corner cells (24 not yet implemented)

      // top left cell (relative)
      if ((row !== 0) && (col !== 0)) {
        // not in top row or left edge
        pay[4] = myStrategy[(this.gameGrid[row - 1][col - 1].strategy) - 1];
      } else {
        if (this.isWrap) {
          // in top left corner
          if (row === 0 && col === 0) {
            pay[4] = myStrategy[(this.gameGrid[edge][edge].strategy) - 1];
            // ^^ returns cell in bottom right corner
          }
          // on top row, but not in left corner
          if (row === 0 && col !== 0) {
            pay[4] = myStrategy[(this.gameGrid[edge][col - 1].strategy) - 1];
          }
          // on left edge, but not in top corner
          if (row !== 0 && col === 0) {
            pay[4] = myStrategy[(this.gameGrid[row - 1][edge].strategy) - 1];
          }
        } else {
          pay[4] = 0;
        }
      }

      // top right cell (relative)
      if ((row !== 0) && (col !== edge)) {
        // not in top row or right edge
        pay[5] = myStrategy[(this.gameGrid[row - 1][col + 1].strategy) - 1];
      } else {
        if (this.isWrap) {
          // in top right corner
          if (row === 0 && col === edge) {
            pay[5] = myStrategy[(this.gameGrid[edge][0].strategy) - 1];
            // ^^ returns cell in bottom left corner
          }
          // on top row, but not in right corner
          if (row === 0 && col !== edge) {
            pay[5] = myStrategy[(this.gameGrid[edge][col + 1].strategy) - 1];
          }
          // on right edge, but not in top corner
          if (row !== 0 && col === edge) {
            pay[5] = myStrategy[(this.gameGrid[row - 1][0].strategy) - 1];
          }
        } else {
          pay[5] = 0;
        }
      }

      // bottom right cell (relative)
      if ((row !== edge) && (col !== edge)) {
        // not in bottom row or right edge
        pay[6] = myStrategy[(this.gameGrid[row + 1][col + 1].strategy) - 1];
      } else {
        if (this.isWrap) {
          // in bottom right corner
          if (row === edge && col === edge) {
            pay[6] = myStrategy[(this.gameGrid[0][0].strategy) - 1];
            // ^^ returns cell in top left corner
          }
          // on bottom row, but not in right corner
          if (row === edge && col !== edge) {
            pay[6] = myStrategy[(this.gameGrid[0][col + 1].strategy) - 1];
          }
          // on right edge, but not in bottom corner
          if (row !== edge && col === edge) {
            pay[6] = myStrategy[(this.gameGrid[row + 1][0].strategy) - 1];
          }
        } else {
          pay[6] = 0;
        }
      }

      // bottom left cell (relative)
      if ((row !== edge) && (col !== 0)) {
        // not in bottom row or left edge
        pay[7] = myStrategy[(this.gameGrid[row + 1][col - 1].strategy) - 1];
      } else {
        if (this.isWrap) {
          // in bottom left corner
          if (row === edge && col === 0) {
            pay[7] = myStrategy[(this.gameGrid[0][edge].strategy) - 1];
            // ^^ returns cell in top right corner
          }
          // on bottom row, but not in left corner
          if (row === edge && col !== 0) {
            pay[7] = myStrategy[(this.gameGrid[0][col - 1].strategy) - 1];
          }
          // on left edge, but not in bottom corner
          if (row !== edge && col === 0) {
            pay[7] = myStrategy[(this.gameGrid[row + 1][edge].strategy) - 1];
          }
        } else {
          pay[7] = 0;
        }
      }

      const tempPay = pay[0] + pay[1] + pay[2] + pay[3] + pay[4] + pay[5] + pay[6] + pay[7];
      return new Cell(cell.strategy, tempPay);
    }
  }





  // given the game with adjusted payoffs, returns cell that has learned strategy around it (conformed to cell with highest payoff)
  learn2DCellFitness(gameWithPayoffs, row: number, col: number) {
    const edge = this.netSize - 1;
    const cellsList = [];
    cellsList.push(gameWithPayoffs[row][col]); // pushes our own cell to list
    // basically this function will compile a list of cells to be compared based on wrapping, neighborhood, etc.
    // and send them off to a function that will return the fittest one
    // top middle cell (relative)
    if (row === 0) {
      // at the top of grid
      if (this.isWrap) {
        cellsList.push(gameWithPayoffs[edge][col]);
      }
    } else {
      // not at top of grid
      cellsList.push(gameWithPayoffs[row - 1][col]);
    }

    // right cell (relative)
    if (col === edge) {
      // at the right side of the grid
      if (this.isWrap) {
        cellsList.push(gameWithPayoffs[row][0]);
      }
    } else {
      // not at right side of grid
      cellsList.push(gameWithPayoffs[row][col + 1]);
    }

    // bottom middle cell (relative)
    if (row === edge) {
      // at the bottom of grid
      if (this.isWrap) {
        cellsList.push(gameWithPayoffs[0][col]);
      }
    } else {
      // not at bottom of grid
      cellsList.push(gameWithPayoffs[row + 1][col]);
    }

    // left cell (relative)
    if (col === 0) {
      // at the left side of grid
      if (this.isWrap) {
        cellsList.push(gameWithPayoffs[row][edge]);
      }
    } else {
      // not at left side of grid
      cellsList.push(gameWithPayoffs[row][col - 1]);
    }

    if (this.hoodType !== 0) {
      // add the corner elements to the cellList, since we are using a Moore neighborhood.
      // If Von Neumann, this block will be skipped

      // top left cell (relative)
      if ((row !== 0) && (col !== 0)) {
        // not in top row or left edge
        cellsList.push(gameWithPayoffs[row - 1][col - 1]);
      } else {
        if (this.isWrap) {
          // in top left corner
          if (row === 0 && col === 0) {
            cellsList.push(gameWithPayoffs[edge][edge]);
            // ^^ returns cell in bottom right corner
          }
          // on top row, but not in left corner
          if (row === 0 && col !== 0) {
            cellsList.push(gameWithPayoffs[edge][col - 1]);
          }
          // on left edge, but not in top corner
          if (row !== 0 && col === 0) {
            cellsList.push(gameWithPayoffs[row - 1][edge]);
          }
        }
      }

      // top right cell (relative)
      if ((row !== 0) && (col !== edge)) {
        // not in top row or right edge
        cellsList.push(gameWithPayoffs[row - 1][col + 1]);
      } else {
        if (this.isWrap) {
          // in top right corner
          if (row === 0 && col === edge) {
            cellsList.push(gameWithPayoffs[edge][0]);
            // ^^ returns cell in bottom left corner
          }
          // on top row, but not in right corner
          if (row === 0 && col !== edge) {
            cellsList.push(gameWithPayoffs[edge][col + 1]);
          }
          // on right edge, but not in top corner
          if (row !== 0 && col === edge) {
            cellsList.push(gameWithPayoffs[row - 1][0]);
          }
        }
      }

      // bottom right cell (relative)
      if ((row !== edge) && (col !== edge)) {
        // not in bottom row or right edge
        cellsList.push(gameWithPayoffs[row + 1][col + 1]);
      } else {
        if (this.isWrap) {
          // in bottom right corner
          if (row === edge && col === edge) {
            cellsList.push(gameWithPayoffs[0][0]);
            // ^^ returns cell in top left corner
          }
          // on bottom row, but not in right corner
          if (row === edge && col !== edge) {
            cellsList.push(gameWithPayoffs[0][col + 1]);
          }
          // on right edge, but not in bottom corner
          if (row !== edge && col === edge) {
            cellsList.push(gameWithPayoffs[row + 1][0]);
          }
        }
      }

      // bottom left cell (relative)
      if ((row !== edge) && (col !== 0)) {
        // not in bottom row or left edge
        cellsList.push(gameWithPayoffs[row + 1][col - 1]);
      } else {
        if (this.isWrap) {
          // in bottom left corner
          if (row === edge && col === 0) {
            cellsList.push(gameWithPayoffs[0][edge]);
            // ^^ returns cell in top right corner
          }
          // on bottom row, but not in left corner
          if (row === edge && col !== 0) {
            cellsList.push(gameWithPayoffs[0][col - 1]);
          }
          // on left edge, but not in bottom corner
          if (row !== edge && col === 0) {
            cellsList.push(gameWithPayoffs[row + 1][edge]);
          }
        }
      }

    }

    return this.return2DFittest(cellsList);
  }

// given list of cells either of length 4 or 8, returns one with highest payoff
// or chooses randomly among ones that have equal payoffs
  return2DFittest(cellsList: Cell[]) {
    let maxCell = cellsList[0];
    const maxCellsList = [];
    for (let i = 1; i < cellsList.length; i++) {
      if (cellsList[i].payoff > maxCell.payoff) {
        maxCell = cellsList[i];
      }
    }
    for (let j = 0; j < cellsList.length; j++) {
      if (cellsList[j].payoff === maxCell.payoff) {
        maxCellsList.push(cellsList[j]);
      }
    }
    if (maxCellsList.length === 1) {
      return maxCellsList[0];
    } else {
      return this.chooseRandomCell(maxCellsList);
    }
  }



  // Iterates the generation for 1D networks
  next1DGen() {
    const tempGame1 = [];
    const tempGame2 = [];
    for (let i = 0; i < this.netSize; i++) {
      tempGame1.push(this.get1DPayoffCell(this.gameGrid[i], i));
    }
    for (let j = 0; j < this.netSize; j++) {
      tempGame2.push(this.learn1DCellFitness(tempGame1, j));
    }
    this.gameGrid = tempGame2;
    this.draw1DGame(this.gameGrid, false);
    this.getPlayerCounts();
  }

  // returns the given cell with its appropriate payoff calculated (based on those around it)
  get1DPayoffCell(cell: Cell, ind: number) {
      let pay1, pay2;
      // if working on first element in network
      if (ind === 0) {
        // if wrapped, play against element on opposite side
        if (this.isWrap) {
          pay1 = this.strategy[cell.strategy][(this.gameGrid[this.netSize - 1].strategy) - 1];
          pay2 = this.strategy[cell.strategy][(this.gameGrid[ind + 1].strategy) - 1];
        } else {
          // no wrap
          pay1 = 0;
          pay2 = this.strategy[cell.strategy][(this.gameGrid[ind + 1].strategy) - 1];
        }
      }
    // if working on last element in network
    if (ind === this.netSize - 1) {
        // if wrapped, play against element on opposite side
        if (this.isWrap) {
          pay1 = this.strategy[cell.strategy][(this.gameGrid[ind - 1].strategy) - 1];
          pay2 = this.strategy[cell.strategy][(this.gameGrid[0].strategy) - 1];
        } else {
          // no wrap
          pay1 = this.strategy[cell.strategy][(this.gameGrid[ind - 1].strategy) - 1];
          pay2 = 0;
        }
      }
      if ((ind > 0) && (ind < this.netSize - 1)) {
        pay1 = this.strategy[cell.strategy][(this.gameGrid[ind - 1].strategy) - 1];
        pay2 = this.strategy[cell.strategy][(this.gameGrid[ind + 1].strategy) - 1];
      }
      return new Cell(cell.strategy, pay1 + pay2);
  }

  // given the game with adjusted payoffs, returns cell that has learned strategy around it (conformed to that with highest payoff)
  learn1DCellFitness(gameWithPayoffs, ind: number) {
    let mine;
    mine = gameWithPayoffs[ind];
    if ((ind > 0 ) && (ind < gameWithPayoffs.length - 1)) {
      return this.return1DFittest(mine, gameWithPayoffs[ind - 1], gameWithPayoffs[ind + 1]);
    }
    // working on leftmost element
    if (ind === 0) {
      if (this.isWrap) {
        return this.return1DFittest(mine, gameWithPayoffs[gameWithPayoffs.length - 1], gameWithPayoffs[1]);
      } else {
        return this.return1DFittest(mine, new Cell(1, -1000000), gameWithPayoffs[1]);
      }
    }
    // working on rightmost element
    if (ind === gameWithPayoffs.length - 1) {
      if (this.isWrap) {
        return this.return1DFittest(mine, gameWithPayoffs[ind - 1], gameWithPayoffs[0]);
      } else {
        return this.return1DFittest(mine, gameWithPayoffs[ind - 1], new Cell(1, -1000000));
      }
    }
  }

  // given three cells, returns one with highest payoff
  return1DFittest(me: Cell, left: Cell, right: Cell) {
    if ((me.payoff > left.payoff) && (me.payoff > right.payoff)) {
      return me;
    }
    if ((left.payoff > me.payoff) && (left.payoff > right.payoff)) {
      return left;
    }
    if ((right.payoff > me.payoff) && (right.payoff > left.payoff)) {
      return right;
    }
    if ((me.payoff === left.payoff) && (me.payoff > right.payoff)) {
      return this.chooseRandomCell([me, left]);
    }
    if ((me.payoff === right.payoff) && (me.payoff > left.payoff)) {
      return this.chooseRandomCell([me, right]);
    }
    if ((me.payoff === right.payoff) && (me.payoff === left.payoff)) {
      return this.chooseRandomCell([me, right, left]);
    }
    if ((right.payoff > me.payoff) && (right.payoff === left.payoff)) {
      return this.chooseRandomCell([right, left]);
    }
  }

  // given list of cells of arbitrary length, returns a random one
  chooseRandomCell(cells: Cell[]) {
    const ind = Math.floor(Math.random() * cells.length);
    return cells[ind];
  }

  toggleShowSettings() {
    this.showSettings = !this.showSettings;
  }

  toggleShowHelp() {
    this.showHelp = !this.showHelp;
  }

  getPlayerCounts() {
    const count = [];
    count[1] = 0; count[2] = 0; count[3] = 0; count[4] = 0;
    if (this.gameGrid.length === 0) {
      alert('Generate a game first!');
    } else {
      if (this.is2D) {
        // count players for 2D game
        for (let i = 0; i < this.netSize; i++) {
          for (let j = 0; j < this.netSize; j++) {
            count[this.gameGrid[i][j].strategy] += 1;
          }
        }
      } else {
        // count players for 1D game
        for (let k = 0; k < this.netSize; k++) {
          count[this.gameGrid[k].strategy] += 1;
        }
      }

      this.s1count = count[1];
      this.s2count = count[2];
      this.s3count = count[3];
      this.s4count = count[4];
      let netSize;
      (this.is2D) ? netSize = Math.pow(this.netSize, 2) : netSize = this.netSize;
      this.cellTotal = netSize;
      this.s1countpercent = Math.round((this.s1count / this.cellTotal) * 10000) / 100;
      this.s2countpercent = Math.round((this.s2count / this.cellTotal) * 10000) / 100;
      this.s3countpercent = Math.round((this.s3count / this.cellTotal) * 10000) / 100;
      this.s4countpercent = Math.round((this.s4count / this.cellTotal) * 10000) / 100;

    }
  }


}
