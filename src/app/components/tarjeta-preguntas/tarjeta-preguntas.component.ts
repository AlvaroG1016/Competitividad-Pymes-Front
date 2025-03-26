import { Component } from '@angular/core';

@Component({
  selector: 'app-tarjeta-preguntas',
  standalone: false,
  templateUrl: './tarjeta-preguntas.component.html',
  styleUrl: './tarjeta-preguntas.component.css'
})
export class TarjetaPreguntasComponent {
  options = ['JavaScript', 'Python', 'Java', 'C#'];
  selectedOption: string = '';
}
