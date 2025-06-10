import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: '/start', 
        pathMatch: 'full'
    },
    {
        path: 'start',
        component: StartComponent
    }
];
