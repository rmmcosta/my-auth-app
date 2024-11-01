import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { AuthService, UserInfo } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  userInfo?: UserInfo;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUserInfo().subscribe((userInfo) => (this.userInfo = userInfo));
  }
}
