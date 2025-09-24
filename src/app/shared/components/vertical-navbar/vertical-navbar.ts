import {Component, OnInit, signal} from '@angular/core';
import {AuthService} from '../../../core/services/common/auth-service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-vertical-navbar',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
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
