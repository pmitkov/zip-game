import { Component } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { MatOption } from "@angular/material/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatCheckbox } from "@angular/material/checkbox";
import { Difficulty } from '../types';
import { NgForOf } from "@angular/common";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'game-menu',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatCheckbox,
    NgForOf,
    MatButton
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  form: FormGroup;

  difficulties: Difficulty[] = [
    {size: '6x6', rows: 6, cols: 6, nodes: 10},
    {size: '8x8', rows: 8, cols: 8, nodes: 15},
    {size: '10x10', rows: 10, cols: 10, nodes: 20},
  ];
  enableWalls: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      checkbox: [this.enableWalls],
      select: [this.difficulties[0]]
    });
  }

  startGame() {

  }
}
