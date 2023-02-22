import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent {
  /**
   * Referencia al héroe que se quiere borrar para mostrar su nombre en el Dialog
   */
  heroToDelete!: Hero;

  /**
   * Constructor DialogDeleteComponent
   * @param dialogRef Referencia al Dialog
   * @param data Datos del héroe que se quiere eliminar
   */
  constructor (public dialogRef: MatDialogRef<DialogDeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: Hero) {
    this.heroToDelete = data;
  }
}
