import {Route} from '@angular/router';
import {ReceiveDelivery} from './pages/receive-delivery/receive-delivery';

export const deliveryRoutes: Route[] = [
    {
        path: 'receive',
        component: ReceiveDelivery
    }
]
