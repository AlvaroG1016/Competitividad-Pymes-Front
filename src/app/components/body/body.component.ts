import { Component, Input, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  standalone: false,

  styleUrl: './body.component.css',
})
export class BodyComponent  {
  @Input() collapsed = false; 
  @Input() screenWidth = 0; 

  getBodyClass():string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed';
    }else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass= 'body-md-screen'
    }

    return styleClass;
  }
}
