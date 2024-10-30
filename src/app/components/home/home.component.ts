import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ResourceService, ResourceInfo } from '../../services/resource.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  resource?: ResourceInfo;

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resourceService
      .getResource()
      .subscribe((resource) => (this.resource = resource));
  }
}
