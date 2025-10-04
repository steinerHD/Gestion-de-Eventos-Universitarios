import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExternalOrganization } from '../../services/organization.service';

@Component({
  selector: 'app-selected-organizations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-organizations.html',
  styleUrls: ['./selected-organizations.css']
})
export class SelectedOrganizationsComponent {
  @Input() selectedOrganizations: ExternalOrganization[] = [];
  @Output() organizationRemoved = new EventEmitter<ExternalOrganization>();

  removeOrganization(organization: ExternalOrganization): void {
    this.organizationRemoved.emit(organization);
  }
}
