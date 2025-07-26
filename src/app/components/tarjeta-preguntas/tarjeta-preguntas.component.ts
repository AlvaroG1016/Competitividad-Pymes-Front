import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tarjeta-preguntas',
  standalone: false,
  templateUrl: './tarjeta-preguntas.component.html',
  styleUrls: ['./tarjeta-preguntas.component.css']
})
export class TarjetaPreguntasComponent {
  @Input() preguntaId: string = ''; // Identificador único de la pregunta
  @Input() question: string = ''; // Recibe la pregunta
  @Input() options: { label: string; value: number }[] = [];
  @Input() selectedOption: string = ''; // Recibe la opción seleccionada desde el padre
  @Output() optionSelected = new EventEmitter<string>(); // Emite la opción seleccionada

  // Getter para manejar el valor seleccionado
  get currentSelectedOption(): number | null {
    // Si selectedOption está vacío o es null/undefined, devolver null
    // Si tiene valor, convertirlo a número
    return this.selectedOption && this.selectedOption !== '' ? Number(this.selectedOption) : null;
  }

  onOptionChange(option: any) {
    this.selectedOption = option.toString(); // Convertir a string para consistencia
    this.optionSelected.emit(option.toString());
  }
}