import { Component } from '@angular/core';
import { Sidebar } from "../../components/map-section/sidebar/sidebar";
import { MapView } from "../../components/map-section/map-view/map-view";

@Component({
  selector: 'app-map-container',
  imports: [Sidebar, MapView],
  templateUrl: './map-container.html',
  styleUrl: './map-container.css'
})
export class MapContainer {

}
