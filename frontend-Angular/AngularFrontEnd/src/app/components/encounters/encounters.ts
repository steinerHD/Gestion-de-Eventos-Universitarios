import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService, Location } from '../../services/location.service';

export interface Encounter {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: Location | null;
}

@Component({
  selector: 'app-encounters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encounters.html',
  styleUrls: ['./encounters.css']
})
export class EncountersComponent implements OnInit {
  @Input() encounters: Encounter[] = [];
  @Output() encountersChanged = new EventEmitter<Encounter[]>();

  showLocationModal: boolean = false;
  currentEncounterId: string = '';
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  searchQuery: string = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
    // Asegurar que siempre hay al menos un encuentro
    if (this.encounters.length === 0) {
      this.addEncounter();
    }
  }

  loadLocations(): void {
    this.locationService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
        this.filteredLocations = locations;
      },
      error: (error) => console.error('Error al cargar lugares:', error)
    });
  }

  addEncounter(): void {
    const newEncounter: Encounter = {
      id: Date.now().toString(),
      date: '',
      startTime: '',
      endTime: '',
      location: null
    };
    this.encounters.push(newEncounter);
    this.emitChanges();
  }

  removeEncounter(encounterId: string): void {
    if (this.encounters.length > 1) {
      this.encounters = this.encounters.filter(encounter => encounter.id !== encounterId);
      this.emitChanges();
    } else {
      alert('El evento debe tener al menos un encuentro.');
    }
  }

  openLocationModal(encounterId: string): void {
    this.currentEncounterId = encounterId;
    this.showLocationModal = true;
    this.searchQuery = '';
    this.filteredLocations = this.locations;
  }

  closeLocationModal(): void {
    this.showLocationModal = false;
    this.currentEncounterId = '';
  }

  selectLocation(location: Location): void {
    const encounter = this.encounters.find(enc => enc.id === this.currentEncounterId);
    if (encounter) {
      encounter.location = location;
      this.emitChanges();
    }
    this.closeLocationModal();
  }

  removeLocation(encounterId: string): void {
    const encounter = this.encounters.find(enc => enc.id === encounterId);
    if (encounter) {
      encounter.location = null;
      this.emitChanges();
    }
  }

  searchLocations(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredLocations = this.locations;
    } else {
      this.locationService.searchLocations(this.searchQuery).subscribe({
        next: (locations) => {
          this.filteredLocations = locations;
        },
        error: (error) => console.error('Error al buscar lugares:', error)
      });
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchLocations();
  }

  onEncounterChange(): void {
    this.emitChanges();
  }

  private emitChanges(): void {
    this.encountersChanged.emit(this.encounters);
  }

  validateEncounters(): boolean {
    return this.encounters.length > 0 && 
           this.encounters.every(encounter => 
             encounter.date && 
             encounter.startTime && 
             encounter.endTime && 
             encounter.location
           );
  }
}
