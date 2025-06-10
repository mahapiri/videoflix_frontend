import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgetPwComponent } from './pages/forget-pw/forget-pw.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: '/start', 
        pathMatch: 'full'
    },
    {
        path: 'start',
        component: StartComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'forget-pw',
        component: ForgetPwComponent
    }
];
