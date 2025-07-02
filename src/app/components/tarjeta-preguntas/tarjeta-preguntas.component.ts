import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tarjeta-preguntas',
  standalone:false,
  templateUrl: './tarjeta-preguntas.component.html',
  styleUrls: ['./tarjeta-preguntas.component.css']
})
export class TarjetaPreguntasComponent {
  @Input() preguntaId: string = ''; // Identificador único de la pregunta
  @Input() question: string = ''; // Recibe la pregunta
  @Input() options: { label: string; value: number }[] = [];
  @Input() selectedOption: string = ''; // Recibe la opción seleccionada desde el padre
  @Output() optionSelected = new EventEmitter<string>(); // Emite la opción seleccionada

  onOptionChange(option: any) {
    this.selectedOption = option;
    this.optionSelected.emit(option);
  }
}