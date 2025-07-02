import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export const ModalNotifyTypes = {
  Success: {
    Id: 1,
    Icon: 'ms-Icon ms-Icon--SkypeCircleCheck',
    Image: '',
    Class: 'success',
  },
  Info: { Id: 2, Icon: 'ms-Icon ms-Icon--InfoSolid', Image: '', Class: 'info' },
  Warning: {
    Id: 3,
    Icon: 'ms-Icon ms-Icon--WarningSolid',
    Image: '',
    Class: 'warning',
  },
  Danger: {
    Id: 4,
    Icon: 'ms-Icon ms-Icon--StatusErrorFull',
    Image: '',
    Class: 'danger',
  },
  Primary: { Id: 5, Icon: '', Image: '', Class: 'primary' },
  Secondary: { Id: 6, Icon: '', Image: '', Class: 'secondary' },
  Light: {
    Id: 6,
    Icon: 'ms-Icon ms-Icon--QuickNoteSolid',
    Image: '',
    Class: 'light',
  },  
  Dark: {
    Id: 6,
    Icon: 'ms-Icon ms-Icon--QuickNoteSolid',
    Image: '',
    Class: 'dark',
  },
  Link: { Id: 6, Icon: 'ms-Icon ms-Icon--Link', Image: '', Class: 'link' },
  Question: {
    Id: 7,
    Icon: 'ms-Icon ms-Icon--UnknownSolid',
    Image: '',
    Class: 'primary',
  },
  QuestionWarning: {
    Id: 8,
    Icon: 'ms-Icon ms-Icon--UnknownSolid',
    Image: '',
    Class: 'warning',
  },
  QuestionDanger: {
    Id: 9,
    Icon: 'ms-Icon ms-Icon--UnknownSolid',
    Image: '',
    Class: 'danger',
  },
};

export interface ModalData {
  title: string;
  message: string;
  buttonLabel: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

@Component({
  selector: "app-modal-notify",
  templateUrl: "./modal-notify.component.html",
  styleUrls: ["./modal-notify.component.scss"],
  standalone:false
})
export class ModalNotifyComponent {
  title: string;
  message: string;
  buttonLabel: string;
  headerClass: string;

  constructor(
    public dialogRef: MatDialogRef<ModalNotifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {
    this.title = data.title;
    this.message = data.message;
    this.buttonLabel = data.buttonLabel || 'Aceptar';
    this.headerClass = data.type || 'info';
  }

  onAccept(): void {
    this.dialogRef.close(true); 
  }
  onclose(): void {
    this.dialogRef.close(false); 
  }
}

