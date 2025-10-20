import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProgressLockService } from '../../services/progress-lock.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  standalone: false,

  styleUrl: './body.component.css',
})
export class BodyComponent implements OnInit, OnDestroy {
  @Input() collapsed = false; 
  @Input() screenWidth = 0; 

  constructor(private progressLockService: ProgressLockService) {}

  ngOnInit(): void {
    this.progressLockService.forceReinitialize();
  }
  ngOnDestroy(): void {
    //this.progressLockService.forceReinitialize();
  }
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
