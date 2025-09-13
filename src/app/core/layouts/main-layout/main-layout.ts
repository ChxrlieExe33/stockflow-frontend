import { Component } from '@angular/core';
import {VerticalNavbar} from '../../../shared/components/vertical-navbar/vertical-navbar';

@Component({
  selector: 'app-main-layout',
    imports: [
        VerticalNavbar
    ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
