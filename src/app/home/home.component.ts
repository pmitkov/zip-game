import { Component } from '@angular/core';
import { ApplicationState, MenuOptions } from '../types';
import { MenuComponent } from '../menu/menu.component';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'home',
  imports: [
    MenuComponent,
    GameComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  applicationState: ApplicationState = 'Menu';

  gameOptions!: MenuOptions;

  startGame(options: MenuOptions) {
    this.gameOptions = options;
    this.applicationState = 'Game';
  }

  showMenu() {
    this.applicationState = 'Menu';
  }
}
