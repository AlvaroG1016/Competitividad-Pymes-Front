import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalNotifyComponent } from './components/modal-notify/modal-notify.component';

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
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LayoutComponent } from './components/layout/layout.component';
import { BodyComponent } from './components/body/body.component';

//Material  Modules
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
// PrimeNG Modules
import { PasswordModule } from 'primeng/password';

import { MessageModule } from 'primeng/message';
import { DropdownModule} from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { MyPreset  } from '../TemaGris';
import { StepsModule } from 'primeng/steps';
import { RadioButton } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { SublevelMenuComponent } from './components/sidenav/sublevel-menu.component';
import { TarjetaPreguntasComponent } from './components/tarjeta-preguntas/tarjeta-preguntas.component';
import { CaracterizacionUsuarioComponent } from './components/caracterizacion-usuario/caracterizacion-usuario.component';
import { QuestionlistComponent } from './components/questionlist/questionlist.component';
import { GestionempresarialComponent } from './components/gestionempresarial/gestionempresarial.component';
import { OperaciongestionservicioComponent } from './components/operaciongestionservicio/operaciongestionservicio.component';
import { AseguramientocalidadComponent } from './components/aseguramientocalidad/aseguramientocalidad.component';
import { MercadeocomercializacionComponent } from './components/mercadeocomercializacion/mercadeocomercializacion.component';
import { EstrategiagestionfinancieraComponent } from './components/estrategiagestionfinanciera/estrategiagestionfinanciera.component';
import { GrecursoshumanosComponent } from './components/grecursoshumanos/grecursoshumanos.component';
import { GambientalComponent } from './components/gambiental/gambiental.component';
import { TecnologiasisComponent } from './components/tecnologiasis/tecnologiasis.component';
import { customInterceptor } from './services/custom.interceptor';
import { CaracterizacionEmpresaComponent } from './components/caracterizacion-empresa/caracterizacion-empresa.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BodyComponent,
    LayoutComponent,
    SidenavComponent,
    SublevelMenuComponent,
    TarjetaPreguntasComponent,
    CaracterizacionUsuarioComponent,
    QuestionlistComponent,
    GestionempresarialComponent,
    OperaciongestionservicioComponent,
    AseguramientocalidadComponent,
    MercadeocomercializacionComponent,
    EstrategiagestionfinancieraComponent,
    GrecursoshumanosComponent,
    GambientalComponent,
    TecnologiasisComponent,
    ModalNotifyComponent,
    CaracterizacionEmpresaComponent
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
    StepsModule,
    RadioButton,
    DropdownModule,
    InputNumberModule,
    MatDialogModule,
    MatButtonModule
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
    provideHttpClient(withInterceptors([customInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
