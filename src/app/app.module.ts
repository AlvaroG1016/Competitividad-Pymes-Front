import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms'; 
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from "primeng/floatlabel"
import { CardModule } from "primeng/card"
import { TooltipModule } from 'primeng/tooltip';

import { RouterModule } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http'; 
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LayoutComponent } from './components/layout/layout.component';
import { BodyComponent } from './components/body/body.component';


// PrimeNG Modules
import { PasswordModule } from 'primeng/password';

import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { MyPreset  } from '../TemaGris';
import { StepsModule } from 'primeng/steps';
import { SublevelMenuComponent } from './components/sidenav/sublevel-menu.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BodyComponent,
    LayoutComponent,
    SidenavComponent,
    SublevelMenuComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ButtonModule,
    IftaLabelModule,
    DatePickerModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    BlockUIModule,
    ToastModule,
    FloatLabelModule,
    CardModule,
    PasswordModule,
    MessageModule,
    RippleModule,
    TooltipModule,
    RouterModule,
    StepsModule
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: MyPreset,
          options: {
              darkModeSelector: false || 'none',
              colorScheme: 'light',
              themeColors: {
                baseColor: '#007ad9',
              }
          }
      },
    }),
    MessageService,
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
