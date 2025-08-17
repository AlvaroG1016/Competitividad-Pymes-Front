// grafico-factores.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonsLibService } from '../../services/commons-lib.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-factores',
  standalone: false,
  templateUrl: './grafico-factores.component.html',
  styleUrls: ['./grafico-factores.component.css'],
})
export class GraficoFactoresComponent implements OnInit {
  
  @ViewChild('chartFactores', { static: false }) chartFactoresRef!: ElementRef;
  @ViewChild('chartVariables', { static: false }) chartVariablesRef!: ElementRef;
  
  chartFactores: any;
  chartVariables: any;
  
  // Datos
  resultadosEncuesta: any = null;
  cargando: boolean = false;
  error: string = '';
  idEncuesta: number = 0;
  
  // Filtros
  factorSeleccionado: number = 0;
  factoresList: any[] = [];

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
      `Respuesta/ObtenerResultadosEncuesta?Id=${this.idEncuesta}`,
      (response: any) => {
        if (response.data) {
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          this.resultadosEncuesta = data;
          this.factoresList = data.resultadosPorFactor || [];
          this.crearGraficoFactores();
          if (this.factoresList.length > 0) {
            this.factorSeleccionado = this.factoresList[0].idFactor;
            this.crearGraficoVariables();
          }
        }
        this.cargando = false;
      },
      (validationErrors) => {
        this.error = 'Error de validación al cargar los datos';
        this.cargando = false;
      },
      (errors) => {
        this.error = 'Error al cargar los datos';
        this.cargando = false;
      }
    );
  }

  limpiarNombreFactor(nombre: string): string {
    return nombre.replace(/\r?\n/g, '').trim();
  }

  crearGraficoFactores(): void {
    if (!this.chartFactoresRef?.nativeElement) {
      setTimeout(() => this.crearGraficoFactores(), 100);
      return;
    }

    if (this.chartFactores) {
      this.chartFactores.destroy();
    }

    const ctx = this.chartFactoresRef.nativeElement.getContext('2d');
    
    const labels = this.factoresList.map(f => this.limpiarNombreFactor(f.nombreFactor));
    const porcentajes = this.factoresList.map(f => f.porcentajeFactor);

    this.chartFactores = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Porcentaje por Factor',
          data: porcentajes,
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#dc3545',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Desempeño por Factores de Competitividad',
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#2c3e50'
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#e9ecef'
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              color: '#e9ecef'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: '#dc3545'
          }
        }
      }
    });
  }

  crearGraficoVariables(): void {
    if (!this.factorSeleccionado || !this.factoresList.length) return;
    
    if (!this.chartVariablesRef?.nativeElement) {
      setTimeout(() => this.crearGraficoVariables(), 100);
      return;
    }

    if (this.chartVariables) {
      this.chartVariables.destroy();
    }

    const factorActual = this.factoresList.find(f => f.idFactor === this.factorSeleccionado);
    if (!factorActual || !factorActual.variables) return;

    const ctx = this.chartVariablesRef.nativeElement.getContext('2d');
    
    const labels = factorActual.variables.map(v => v.nombreVariable);
    const porcentajes = factorActual.variables.map(v => v.porcentajeVariable);

    this.chartVariables = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Porcentaje por Variable',
          data: porcentajes,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#007bff',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Variables del Factor: ${this.limpiarNombreFactor(factorActual.nombreFactor)}`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: '#2c3e50'
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#e9ecef'
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              color: '#e9ecef'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: '#007bff'
          }
        }
      }
    });
  }

  onFactorChange(event: any): void {
    this.factorSeleccionado = parseInt(event.target.value);
    this.crearGraficoVariables();
  }

  reintentar(): void {
    this.cargarDatos();
  }

  obtenerClasePorcentaje(porcentaje: number): string {
    if (porcentaje >= 80) return 'porcentaje-excelente';
    if (porcentaje >= 60) return 'porcentaje-bueno';
    if (porcentaje >= 40) return 'porcentaje-regular';
    return 'porcentaje-malo';
  }

  obtenerVariablesDelFactor(): any[] {
    const factor = this.factoresList.find(f => f.idFactor === this.factorSeleccionado);
    return factor?.variables || [];
  }
}