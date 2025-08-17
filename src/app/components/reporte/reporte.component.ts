// reporte.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonsLibService } from '../../services/commons-lib.service';

@Component({
  selector: 'app-reporte',
  standalone: false,
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
})
export class ReporteComponent implements OnInit {
  
  // Datos del backend - SIN valores dummy
  puntajeEmpresa: number = 0;
  mediaSistema: number = 0;
  cantidadEmpresas: number = 0;
  diferencia: number = 0;
  estado: string = '';
  mensaje: string = '';
  
  // Estados de la UI
  cargando: boolean = false;
  error: string = '';
  idEncuesta: number = 0;

  constructor(private readonly service: CommonsLibService) {}

  ngOnInit(): void {
    this.obtenerIdEncuesta();
  }

  private obtenerIdEncuesta(): void {
    this.service.getWithHandling(
      `CaracterizacionUsuario/GetIdEncuenstaByEmpresa`,
      (response: any) => {
        if (response.data && response.data[0] && response.data[0].idEncuesta) {
          this.idEncuesta = response.data[0].idEncuesta;
          this.cargarDatos();
        }
      },
      (validationErrors) => {
        this.error = 'Error al obtener información de la empresa';
        this.cargando = false;
      },
      (errors) => {
        this.error = 'Error al obtener información de la empresa';
        this.cargando = false;
      }
    );
  }

  cargarDatos(): void {
    if (!this.idEncuesta) {
      this.error = 'No se pudo obtener el ID de la encuesta';
      return;
    }

    this.cargando = true;
    this.error = '';
    
    this.service.getWithHandling(
      `Respuesta/ObtenerComparativoCompetitividad?idEncuesta=${this.idEncuesta}`,
      (response: any) => {
        if (response.data) {
          // Los datos vienen en un array, tomamos el primer elemento
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          this.puntajeEmpresa = data.puntajeEmpresa;
          this.mediaSistema = data.mediaSistema;
          this.cantidadEmpresas = data.cantidadEmpresas;
          this.diferencia = data.diferencia;
          this.estado = data.estado;
          this.mensaje = data.mensaje;
        }
        this.cargando = false;
      },
      (validationErrors) => {
        this.error = 'Error de validación al cargar el reporte';
        this.cargando = false;
      },
      (errors) => {
        this.error = 'Error al cargar el reporte';
        this.cargando = false;
      }
    );
  }

  obtenerEstado(): string {
    return this.estado || 'Cargando...';
  }

  obtenerColor(): string {
    switch (this.estado) {
      case 'Superior': return '#28a745';
      case 'En la media': return '#17a2b8';
      case 'Por debajo': return '#dc3545';
      default: return '#6c757d';
    }
  }

  obtenerDiferencia(): number {
    return this.diferencia;
  }

  obtenerMensaje(): string {
    return this.mensaje || 'Calculando comparativo...';
  }

  reintentar(): void {
    this.cargarDatos();
  }
}