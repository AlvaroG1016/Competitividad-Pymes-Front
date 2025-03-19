import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BaseService } from '../../services/base.service';
import { CommonsLibService } from '@commons-lib';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css',
})
export class UserNavComponent  {
  private usernameSubscription: Subscription | null = null;
  private roleSubscription: Subscription | null = null;
  userName: any;
  role: any;
   userNameSource = new BehaviorSubject<string | null>(localStorage.getItem('userName') || null);
   userRoleSource = new BehaviorSubject<string | null>(localStorage.getItem('userRole') || null);
  
  constructor(private readonly authService:AuthService) {}

    logout() {
      this.authService.logout();
    }
}
