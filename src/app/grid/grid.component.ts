import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Cell, Coordinates, Difficulty, Direction, Path } from '../types';
import { Observable } from 'rxjs';

@Component({
  selector: 'game-grid',
  imports: [],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements AfterViewInit {
  @Input({required: true})
  rows!: number;
  @Input({required: true})
  cols!: number;
  @Input({required: true})
  cellSizePx!: number;
  @Input({required: true})
  borderSizePx!: number;
  @Input({required: true})
  selectedCells!: Cell[];
  @Input({required: true})
  currentPath!: Observable<Path>;

  private height!: number;
  private width!: number;

  @ViewChild('gameCanvas', {static: true})
  canvasRef!: ElementRef<HTMLCanvasElement>

  private ctx!: CanvasRenderingContext2D;

  constructor() { }

  ngAfterViewInit(): void {
    this.height = this.rows * this.cellSizePx + this.borderSizePx * (this.rows + 1);
    this.width = this.cols * this.cellSizePx + this.borderSizePx * (this.cols + 1);
    const canvas = this.canvasRef.nativeElement;
    canvas.height = this.height;
    canvas.width = this.width;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.font = "25px Arial";
    this.drawGrid();
    this.drawSelectedCells();
    this.highlightCell(this.selectedCells[0]);
    this.currentPath.subscribe(path => {
      this.drawPath(path);
    })
  }

  private drawGrid() {
    this.ctx.fillStyle = '#cecece';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = '#444242';
    this.ctx.lineWidth = this.borderSizePx;
    // draw rows
    for (let i = 0; i <= this.rows; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.borderSizePx / 2 + i * (this.cellSizePx + this.borderSizePx));
      this.ctx.lineTo(this.width, this.borderSizePx / 2 + i * (this.cellSizePx + this.borderSizePx));
      this.ctx.stroke();
    }
    // draw cols
    for (let i = 0; i <= this.cols; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.borderSizePx / 2 + i * (this.cellSizePx + this.borderSizePx), 0);
      this.ctx.lineTo(this.borderSizePx / 2 + i * (this.cellSizePx + this.borderSizePx), this.height);
      this.ctx.stroke();
    }
  }

  private highlightCell(cell: Cell) {
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillStyle = '#68a83f';
    const coordinates = this.getCoordinates(cell);
    this.ctx.fillRect(coordinates[0], coordinates[1], this.cellSizePx, this.cellSizePx);
    this.ctx.globalAlpha = 1;
  }

  private highlightCellCenter(cell: Cell) {
    this.ctx.fillStyle =  '#49ce05';
    const coordinates = this.getCenterCoordinates(cell);
    this.ctx.beginPath();
    this.ctx.arc(coordinates[0], coordinates[1], this.cellSizePx / 6, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private highlightCellPath(cell: Cell, direction: Direction) {
    this.ctx.fillStyle =  '#49ce05';
    const coordinates = this.getCoordinates(cell);
    if (direction === 'Left') {
      this.ctx.fillRect(coordinates[0], coordinates[1] + this.cellSizePx / 2 - this.cellSizePx / 6, this.cellSizePx / 2, this.cellSizePx / 3);
    } else if (direction === 'Right') {
      this.ctx.fillRect(coordinates[0] + this.cellSizePx / 2, coordinates[1] + this.cellSizePx / 2 - this.cellSizePx / 6, this.cellSizePx / 2, this.cellSizePx / 3);
    } else if (direction === 'Up') {
      this.ctx.fillRect(coordinates[0] + this.cellSizePx / 2 - this.cellSizePx / 6, coordinates[1], this.cellSizePx / 3, this.cellSizePx / 2);
    } else {
      this.ctx.fillRect(coordinates[0] + this.cellSizePx / 2 - this.cellSizePx / 6, coordinates[1] + this.cellSizePx / 2, this.cellSizePx / 3, this.cellSizePx / 2);
    }
  }

  private drawSelectedCells() {
    this.ctx.strokeStyle = '#000000';
    this.ctx.fillStyle = "#297daf";
    for (let i = 0; i < this.selectedCells.length; i++) {
      const coordinates = this.getCenterCoordinates(this.selectedCells[i]);
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(coordinates[0], coordinates[1], this.cellSizePx / 4, 0,  2 * Math.PI);
      this.ctx.stroke();
      this.ctx.fillText(String(i + 1),coordinates[0] - this.cellSizePx / 8, coordinates[1] + this.cellSizePx / 8);
    }
  }

  private drawPath(path: Path) {
    this.drawGrid();
    for (const cell of path) {
      this.highlightCellCenter(cell);
    }
    for (let i = 0; i < path.length; i++) {
      if (i > 0) {
        this.highlightCellPath(path[i], this.getDirection(path[i - 1].row - path[i].row, path[i - 1].col - path[i].col));
      }
      if (i < path.length - 1) {
        this.highlightCellPath(path[i], this.getDirection(path[i + 1].row - path[i].row, path[i + 1].col - path[i].col));
      }
    }
    for (const cell of path) {
      this.highlightCell(cell);
    }
    this.drawSelectedCells();
  }

  private getCoordinates(cell: Cell): Coordinates {
    return [
      this.borderSizePx * (cell.row + 1) + cell.row * this.cellSizePx,
      this.borderSizePx * (cell.col + 1) + cell.col * this.cellSizePx
    ];
  }

  private getCenterCoordinates(cell: Cell): Coordinates {
    const coordinates = this.getCoordinates(cell);
    return [
      coordinates[0] + this.cellSizePx / 2,
      coordinates[1] + this.cellSizePx / 2
    ];
  }

  private getDirection(xDiff: number, yDiff: number): Direction {
   if (xDiff === 0) {
     if (yDiff === -1) {
       return 'Up';
     } else {
       return 'Down';
     }
   } else {
     if (xDiff === -1) {
       return 'Left';
     } else {
       return 'Right';
     }
   }
  }
}
