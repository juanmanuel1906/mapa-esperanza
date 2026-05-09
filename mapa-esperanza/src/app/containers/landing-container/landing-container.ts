import { Component } from '@angular/core';
import { LandingNavbar } from "../../components/landing-section/landing-navbar/landing-navbar";
import { LandingHero } from "../../components/landing-section/landing-hero/landing-hero";

@Component({
  selector: 'app-landing-container',
  imports: [LandingNavbar, LandingHero],
  templateUrl: './landing-container.html',
  styleUrl: './landing-container.css'
})
export class LandingContainer {

}
