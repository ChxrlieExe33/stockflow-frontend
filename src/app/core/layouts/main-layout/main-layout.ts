import { Component } from '@angular/core';
import {VerticalNavbar} from '../../../shared/components/vertical-navbar/vertical-navbar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
    imports: [
        VerticalNavbar,
        RouterOutlet
    ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
