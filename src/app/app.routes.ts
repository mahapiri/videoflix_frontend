import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgetPwComponent } from './pages/forget-pw/forget-pw.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

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
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'imprint',
        component: ImprintComponent
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
    },
];
