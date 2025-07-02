import { Component } from '@angular/core';

@Component({
  selector: 'app-aseguramientocalidad',
  standalone: false,
  templateUrl: './aseguramientocalidad.component.html',
  styleUrl: './aseguramientocalidad.component.css'
})
export class AseguramientocalidadComponent {
  factores = [
    {
      nombre: 'AC.1.- Modelo de Calidad',
      preguntas: [
        { id:'AC.1.1', question: '¿La empresa cuenta con un modelo de aseguramiento y control de la calidad para garantizar la eficiencia en la prestación de servicios?' },
        { id:'AC.1.2', question: '¿La organización hace auditorías internas para la evaluación de la calidad?' },
        { id:'AC.1.3', question: '¿La organización cuenta con procesos de capacitación en calidad orientados al mejoramiento de los procesos a partir de sus colaboradores?' },
      ]
    },
    {
      nombre: 'AC.2.- Sostenibilidad',
      preguntas: [
        {id:'AC.2.1', question: '¿La organización promueve prácticas para favorecer la sostenibilidad de sus procesos?' },
        {id:'AC.2.2', question: '¿La organización cuenta con indicadores para medir el grado de sostenibilidad de sus procesos y servicios?' },
        {id:'AC.2.3', question: '¿La organización cuenta con indicadores para medir el grado de sostenibilidad de sus procesos y servicios?' },
      ]
    }
  ];
}
