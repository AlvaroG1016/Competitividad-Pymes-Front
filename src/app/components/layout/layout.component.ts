import { Component } from '@angular/core';
//import {SideNavToggle} from '../../interfaces/generalInterfaces'

@Component({
  selector: 'app-layout',
  standalone: false,

  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {


  isSideNavCollapsed = false;
  screenWidth = 0;
  
  onToogleSideNav(data: any): void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    
  }
}
