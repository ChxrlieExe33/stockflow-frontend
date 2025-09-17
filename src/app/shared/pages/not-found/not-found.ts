import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [],
    templateUrl: './not-found.html',
    styleUrl: './not-found.css'
})
export class NotFound implements OnInit {

    protected message = signal<string | undefined>(undefined);

    constructor(private readonly activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {

        const message: string = this.activatedRoute.snapshot.queryParams['message'];

        if (message) {
            this.message.set(message);
        }

    }

}
