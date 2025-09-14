import {Component, OnInit, signal} from '@angular/core';
import {AuthService} from '../../../core/services/common/auth-service';

@Component({
  selector: 'app-vertical-navbar',
  imports: [],
  templateUrl: './vertical-navbar.html',
  styleUrl: './vertical-navbar.css'
})
export class VerticalNavbar implements OnInit {

    username = signal<string | undefined>(undefined);

    constructor(private authService: AuthService) { }

    ngOnInit() {

        this.username.set(this.authService.getCurrentUsername());
    }

    logout(): void {
        this.authService.logout();
    }

}
