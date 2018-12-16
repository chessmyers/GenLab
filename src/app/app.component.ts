import {Component} from '@angular/core';
import {Cell} from './models/cell';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public is2D: boolean;
  private exists2D = true;
  private isWrap: boolean;
  private hoodType: number;
  private learnMethod: number;
  private radius: number;
  public matrixWidth = 4;
  //  ^ user-selected size of the matrix; can be 4 or 16
  private netSize: number;
  public matrixSize = 0;
  //  ^^ number of strategies currently being used in the matrix (always 2 or greater)
  private s1percent: number;
  private s2percent: number;
  private s3percent: number;
  private s4percent: number;
  private spercent = new Array(17).fill(0);
  // ^^ the percentages used for initialization

  public genNum = 0;
  public scount = new Array(17).fill(0);
  public scountpercent = new Array(17).fill(0);
  public cellTotal = 0;
  public showSettings = true;
  public showHelp = false;
  public showMatrixPanel = false;

  private strategy = [];

  private gameGrid = [];

  private cellSize: string;
  private color: string[] = ['', // 0
                    'chartreuse', // 1
                    'indigo', // 2
                    'orange', // 3
                    'deeppink', // 4
                    'aqua', // 5
                    'yellow', // 6
                    'sienna', // 7
                    'blue', // 8
                    'darkred', // 9
                    'olive', // 10
                    'moccasin', // 11
                    'teal', // 12
                    'royalblue', // 13
                    'dimgrey', // 14
                    'peru', // 15
                    'plum']; // 16

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
    this.netSize = (game.netSize === '' || game.netSize === null) ? 20 : parseInt(game.netSize, 10);
    this.cellSize = (game.cellSize === '' || game.cellSize === null) ? '10px' : game.cellSize.concat('px');
    this.matrixWidth = game.matrixWidth === '' ? 4 : parseInt(game.matrixWidth, 10);

    if (this.matrixWidth === 4) {
      if (game.cell4 === '') {
        if (game.cell3 === '') {
          this.matrixSize = 2;
        } else {
          this.matrixSize = 3;
        }
      } else {
        this.matrixSize = 4;
      }
    } else {
      // using 16x16 matrix
      for (let i = 16; i > 0; i--) {
        if ((<HTMLInputElement>document.getElementById(i.toString(10))).value !== '') {
          this.matrixSize = i;
          break;
        }
      }
    }

    if (this.matrixWidth === 4) {
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
    } else {
      // Initialize 256-cell grid
      // matrixSize: amount of strategies being used

      // get strategy percentages
      const even = Math.round(100 / this.matrixSize);
      for (let i = 1; i <= this.matrixSize; i++) {
        const percent = (<HTMLInputElement>document.getElementById('prob'.concat(i.toString()))).value;
        this.spercent[i] = (percent === '' ? even : parseInt(percent, 10));
      }
      // get strategies
      const tempStrats = [];
      for (let j = 1; j <= this.matrixSize; j++) {
        tempStrats[j] = [];
        for (let k = 1; k <= this.matrixSize; k++) {
          const ind = k + ((j - 1) * 16);
          const strat = (<HTMLInputElement>document.getElementById(ind.toString())).value;
          tempStrats[j].push(parseInt(strat, 10));
        }
      }
      this.strategy = tempStrats;
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

  getCellStyle(strat: number): HTMLElement {
    const cell = document.createElement('td');
    cell.style.borderWidth = '1px';
    cell.style.width = this.cellSize;
    cell.style.height = this.cellSize;
    cell.style.backgroundColor = this.color[strat];
    return cell;
  }

// Returns a cell randomly generated based on given probabilities
  getCell(): Cell {
    const r = Math.random() * 100;
    // spercent[x] = inputted percentage of that strategy appearing
    // matrixSize = # of strategies being used
    if (this.matrixWidth === 16) {
      // gen for big matrix
      const tempPercents = new Array(this.matrixSize + 1);
      for (let i = 1; i <= this.matrixSize; i++) {
        if (i === 1) {
          tempPercents[i] = 100 - this.spercent[i];
        } else {
          tempPercents[i] = tempPercents[i - 1] - this.spercent[i];
        }
      }

      for (let j = 1; j <= this.matrixSize; j++) {
        if (r > tempPercents[j]) {
          return new Cell(j, 0);
        }
      }

      return new Cell(1, 0);
    } else {
      // gen for small matrix
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
  }

// nextGen: executed when next generation button is pressed
  nextGen() {
    this.genNum += 1;
    if (this.gameGrid.length === 0) {
      // No network has been created yet
      alert('Generate a network first!');
    } else {
      if (this.is2D) {
        switch (this.learnMethod) {
          case 0: this.next2DGenITBProbImit(false); break;
          case 1: this.next2DGenMBR(); break;
          case 2: this.next2DGenITBProbImit(true); break;
          default: this.next2DGenITBProbImit(false); break;
        }

      } else {
        switch (this.learnMethod) {
          case 0: this.next1DGenITBProbImit(false); break;
          case 1: this.next1DGenMBR(); break;
          case 2: this.next1DGenITBProbImit(true); break;
          default: this.next1DGenITBProbImit(false); break;
        }

      }
    }
  }



  // Iterates the generation for 2D networks with the Imitate-the-best learning strategy or Probabilistic Imitation
  next2DGenITBProbImit(withProbImit: boolean) {
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
        tempGame2[k][g] = this.learn2DCellFitness(tempGame1, k, g, withProbImit);
      }
    }
    this.gameGrid = tempGame2;
    this.draw2DGame(this.gameGrid);
    }


  // Creates the next generation using the Myopic best response learning strategy
  next2DGenMBR() {
    const tempGame = [];
    for (let i = 0; i < this.netSize; i++) {
      tempGame.push([]);
      tempGame[i].push(new Array(this.netSize));
      for (let j = 0; j < this.netSize; j++) {
        // working on one cell; following code finds best strategy's payoff, and sets cell to that strategy
        const tempList = [];
        for (let q = 1; q <= this.matrixSize; q++) {
          tempList.push(this.get2DPayoffCell(new Cell(q, 0), i, j));
          //  ^^ get2DPayoffCell: Cell: cell, row: number, col: number --> Cell
        }
        tempGame[i][j] = this.returnFittestCell(tempList);
      }
    }
    this.gameGrid = tempGame;
    this.draw2DGame(this.gameGrid);
  }



  // returns the given cell with its appropriate payoff calculated (based on those around it)
  get2DPayoffCell(cell: Cell, row: number, col: number): Cell {
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
  // works by collecting a list of all cells surrounding a certain index, and then sending it off to a function that returns the fittest one
  learn2DCellFitness(gameWithPayoffs, row: number, col: number, withProbImit: boolean) {
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

    if (withProbImit) {
      return this.returnFittestCellWithProbability(cellsList);
    } else {
      return this.returnFittestCell(cellsList);
    }
  }

// given list of cells arbitrary length returns one with highest payoff
// or chooses randomly among ones that have equal payoffs
  returnFittestCell(cellsList: Cell[]) {
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

  // given list of cells with payoffs calculated, returns cell with probability proportional the size of its payoff compared to the total
  returnFittestCellWithProbability(cellsList: Cell[]) {
    let totalPayoff = 0;
    const payoffList: number[] = [];
    const randNum = Math.random();
    const cll = cellsList.length;

    for (let i = 0; i < cll; i++) {
      totalPayoff += cellsList[i].payoff;
    }
    for (let j = 0; j < cll; j++) {
      if (j === 0) {
        payoffList[j] = 1 - (cellsList[j].payoff / totalPayoff);
      } else {
        payoffList[j] = payoffList[j - 1] - (cellsList[j].payoff / totalPayoff);
      }
    }
    for (let k = 0; k < cll; k++) {
      if (payoffList[k] <= randNum) {
        return cellsList[k];
      }
    }
    return cellsList[cll - 1];
  }



  // Iterates the next generation for 1D networks using Imitate-the-best learning method
  next1DGenITBProbImit(withProbImit: boolean) {
    const tempGame1 = [];
    const tempGame2 = [];
    for (let i = 0; i < this.netSize; i++) {
      tempGame1.push(this.get1DPayoffCell(this.gameGrid[i], i));
    }
    for (let j = 0; j < this.netSize; j++) {
      tempGame2.push(this.learn1DCellFitness(tempGame1, j, withProbImit));
    }
    this.gameGrid = tempGame2;
    this.draw1DGame(this.gameGrid, false);
  }

  // Iterates the next generation for 1D networks using the Myoptic Best Response learning method
  next1DGenMBR() {
      const tempGame = [];
      for (let i = 0; i < this.netSize; i++) {
          // working on one cell; following code finds best strategy's payoff, and sets cell to that strategy
          const tempList = [];
          for (let q = 1; q <= this.matrixSize; q++) {
            tempList.push(this.get1DPayoffCell(new Cell(q, 0), i));
            //  ^^ get1DPayoffCell: Cell: cell, row: number, col: number --> Cell
          }
          tempGame[i] = this.returnFittestCell(tempList);
        }
      this.gameGrid = tempGame;
      this.draw1DGame(this.gameGrid, false);
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
  learn1DCellFitness(gameWithPayoffs, ind: number, withProbImit: boolean) {
    let mine;
    mine = gameWithPayoffs[ind];
    if ((ind > 0 ) && (ind < gameWithPayoffs.length - 1)) {
      // not at an edge
      if (withProbImit) {
        return this.returnFittestCellWithProbability([mine, gameWithPayoffs[ind - 1], gameWithPayoffs[ind + 1]]);
      } else {
        return this.returnFittestCell([mine, gameWithPayoffs[ind - 1], gameWithPayoffs[ind + 1]]);
      }
    }
    // working on leftmost element
    if (ind === 0) {
      if (this.isWrap) {
        if (withProbImit) {
          return this.returnFittestCellWithProbability([mine, gameWithPayoffs[gameWithPayoffs.length - 1], gameWithPayoffs[1]]);
        } else {
          return this.returnFittestCell([mine, gameWithPayoffs[gameWithPayoffs.length - 1], gameWithPayoffs[1]]);
        }
      } else {
        if (withProbImit) {
          return this.returnFittestCellWithProbability([mine, new Cell(1, -1000000), gameWithPayoffs[1]]);
        } else {
          return this.returnFittestCell([mine, new Cell(1, -1000000), gameWithPayoffs[1]]);
        }
      }
    }
    // working on rightmost element
    if (ind === gameWithPayoffs.length - 1) {
      if (this.isWrap) {
        if (withProbImit) {
          return this.returnFittestCellWithProbability([mine, gameWithPayoffs[ind - 1], gameWithPayoffs[0]]);
        } else {
          return this.returnFittestCell([mine, gameWithPayoffs[ind - 1], gameWithPayoffs[0]]);
        }
      } else {
        if (withProbImit) {
          return this.returnFittestCellWithProbability([mine, gameWithPayoffs[ind - 1], new Cell(1, -1000000)]);
        } else {
          return this.returnFittestCell([mine, gameWithPayoffs[ind - 1], new Cell(1, -1000000)]);
        }
      }
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

  reDrawGame() {
    let cellSize = (<HTMLInputElement>document.getElementById('cellSize')).value;
    this.cellSize = (cellSize === '' || cellSize === null) ? '10px' : cellSize.concat('px');
    this.is2D ? this.draw2DGame(this.gameGrid) : this.draw1DGame(this.gameGrid, false);
  }

  updateMatrixWidth() {
    this.matrixWidth = parseInt(((<HTMLSelectElement>document.getElementById('matrixWidth')).value), 10);
    this.showMatrixPanel = false;
  }

  getPlayerCounts() {
    const count = new Array(17).fill(0);
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

      const clength = count.length;
      for (let j = 1; j < clength; j++) {
        this.scount[j] = count[j];
      }

      let netSize;
      (this.is2D) ? netSize = Math.pow(this.netSize, 2) : netSize = this.netSize;
      this.cellTotal = netSize;
      for (let q = 1; q < clength; q++) {
        this.scountpercent[q] = Math.round((this.scount[q] / this.cellTotal) * 10000) / 100;
      }

    }
  }

}
