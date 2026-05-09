import { Routes } from '@angular/router';
import { MapContainer } from './containers/map-container/map-container';
import { LandingContainer } from './containers/landing-container/landing-container';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: LandingContainer
    },
    {
        path: 'map',
        component: MapContainer
    },
];
