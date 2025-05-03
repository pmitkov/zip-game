import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Cell, Difficulty } from '../types';
import { Direction } from '@angular/cdk/bidi';

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
    this.drawGrid();
  }

  drawGrid() {
    console.log('drawGrid');
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = '#050505';
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

  highlightCell(cell: Cell) {

  }

  drawBody(cell: Cell, incomingDirection: Direction | null, outgoingDirection: Direction | null) {

  }
}
