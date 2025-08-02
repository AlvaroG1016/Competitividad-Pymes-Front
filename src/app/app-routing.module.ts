import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
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
import { authGuard } from './guards/auth.guard';
import { CaracterizacionEmpresaComponent } from './components/caracterizacion-empresa/caracterizacion-empresa.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full' }, 
  {path:'login', component: LoginComponent},
  {path:'home', component:LayoutComponent,
    canActivate: [authGuard], 
    children:[  
      {path:'caracterizacionusuario', component:CaracterizacionUsuarioComponent},
      {path:'caracterizacionempresa', component:CaracterizacionEmpresaComponent},
      {path:'gestionempresarial', component:GestionempresarialComponent},
      {path:'opgestionservicio', component:OperaciongestionservicioComponent},
      {path:'aseguramientocalidad', component:AseguramientocalidadComponent},
      {path:'mercadeocomercializacion', component:MercadeocomercializacionComponent},
      {path:'estrategiagestionf', component:EstrategiagestionfinancieraComponent},
      {path:'grecursoshumanos', component:GrecursoshumanosComponent},
      {path:'gambiental', component:GambientalComponent},
      {path:'tsis', component:TecnologiasisComponent},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
