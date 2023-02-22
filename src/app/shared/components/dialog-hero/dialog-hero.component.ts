import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-hero',
  templateUrl: './dialog-hero.component.html',
  styleUrls: ['./dialog-hero.component.css']
})
export class DialogHeroComponent implements OnInit {
  /**
   * Heroe que se quiere modificar o añadir
   */
  hero!: Hero;
  /**
   * Flag que controla si el dialog se está utilizando para modificar o añadir y así reutilizar código
   */
  isAddHero!: boolean

  /**
   * Referencia al formulario que se va a manipular
   */
  formInstance!: FormGroup;

  /**
   * Constructor DialogHeroComponent
   * @param dialogRef Referencia al Dialog
   * @param data Datos del héroe que se quiere añadir o modificar
   */
  constructor (public dialogRef: MatDialogRef<DialogHeroComponent>, @Inject(MAT_DIALOG_DATA) public data: Hero) {
    this.hero = data;
    // Construimos el formulario con sus controls y validadores
    // Indicamos el id que será el que corresponde al héroe modificado, o al siguiente id si se trata de añadir
    this.formInstance = new FormGroup({
      "id": new FormControl({ value: this.hero.id, disabled: true }, Validators.required),
      "name": new FormControl('', Validators.required),
      "image": new FormControl('', Validators.required),
      "colors": new FormControl('', Validators.required)
    });
    this.formInstance.setValue(this.hero);
  }

  /**
   * Inicialización datos
   */
  ngOnInit() {
    // Comprobamos si se trata de añadir o modificar héroe para reutilizar el componente y hacer cambios en la view
    if (this.hero.name.length === 0) {
      this.isAddHero = true;
    } else {
      this.isAddHero = false;
    }
  }

  /**
   * Evento que controla cuando se da click al botón de "Añadir" o "Modificar" para que
   * el componente padre pueda seguir con el proceso y comunicarse con el back-end
   */
  saveHero() {
    this.hero = {
      id: this.hero.id,
      name: this.formInstance.get('name')?.value,
      image: this.formInstance.get('image')?.value,
      colors: this.formInstance.get('colors')?.value,
    }
    this.dialogRef.close(this.hero);
  }
}
