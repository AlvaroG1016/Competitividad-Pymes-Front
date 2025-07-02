import { Component } from '@angular/core';

@Component({
  selector: 'app-gambiental',
  standalone: false,
  templateUrl: './gambiental.component.html',
  styleUrl: './gambiental.component.css'
})
export class GambientalComponent {
  factores = [
    {
      nombre: 'GA.1. Sostenibilidad',
      preguntas: [
        { id:'GA.1.1', question: '¿La organización cuenta con una política de sostenibilidad ambiental?' },
        { id:'GA.1.2', question: '¿Existen estrategias para la evaluación y uso eficiente de recursos (agua, energía, insumos)?' },
        { id:'GA.1.3', question: '¿Hay acciones para la gestión y disposición final de residuos?' },
        { id:'GA.1.4', question: '¿Se toman medidas para reducir el impacto ambiental derivado de la operación logística o productiva?' },
      ]
    },
    {
      nombre: 'GA.2. Protección del medio ambiente y compensación ambiental',
      preguntas: [
        {id:'GA.2.1', question: '¿Se implementan acciones de protección y promoción del medio ambiente?' },
        {id:'GA.2.2', question: '¿La organización cuenta con acciones de compensación ambiental (reforestación, proyectos verdes, etc.)?' },
        {id:'GA.2.3', question: '¿Se promueven prácticas de cuidado ambiental entre clientes y/o proveedores?' },
      ]
    },
    
  ];
}
