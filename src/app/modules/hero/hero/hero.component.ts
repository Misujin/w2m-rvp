import { DialogHeroComponent } from './../../../shared/components/dialog-hero/dialog-hero.component';
import { HeroService } from './hero.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  //
  //
  // VARIABLES
  //
  //

  /**
   * Referencia a la lista de heroes obtenida del servicio
   */
  heroes!: Hero[];

  /**
   * Contador de siguiente ID para la gestión de añadir nuevos héroes
   */
  heroIdCount!: number;

  /**
   * Columnas que se mostrarán en la tabla de Angular Material
   */
  displayedColumns!: string[];

  /**
   * Fuente de datos que utilizará la tabla de Angular Material
   */
  dataSource!: MatTableDataSource<Hero>;

  /**
   * Flag que indica si se están cargando datos o no del back-end falso para mostrar un spinner
   */
  isLoadingData!: boolean;

  /**
   * Referencia al paginador de la tabla para inicializarlo
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //
  //
  // CONSTRUCTOR & LIFECYCLE
  //
  //

  /**
   * Constructor de HeroComponent
   * @param heroService Servicio que simula el back-end de donde obtendremos los datos
   * @param dialog Ventana dialog utilizada para confirmaciones y edición de datos
   */
  constructor(private heroService: HeroService, public dialog: MatDialog) {}

  /**
   * Inicialización de variables
   */
  ngOnInit() {
    this.heroes = [];
    this.isLoadingData = false;
    this.displayedColumns = ['id', 'name', 'image', 'colors', 'actions'];
    // Obtenemos los datos del back-end
    this.apiGetAllHeroes();
  }

  //
  //
  // EVENTOS
  //
  //

  /**
   * Controla los cambios en el input que permite a los usuarios buscar héroes que incluyen cierto string
   * @param event Evento que incluye el nuevo valor de la cadena introducida
   */
  onSearchHeroChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Devolvemos del back-end los héroes que coincidan
    this.apiGetHeroesByString(filterValue);
  }

  /**
   * Controla el evento de click en el botón de añadir héroe
   */
  onAddHeroClick() {
    // Montamos hero dummy con el siguiente ID a añadir para que lo pueda leer el componente del Dialog
    let heroAux: Hero = {
      id: this.heroIdCount,
      name: '',
      image: '',
      colors: ''
    }
    // Abrimos dialog Angular Material (creado en shared>components>DialogHeroComponent)
    const dialogRef = this.dialog.open(DialogHeroComponent, {
      width: '300px',
      data: heroAux
    });
    // Una vez cerrado y confirmado, lo añadimos a los heroes en el back-end
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroIdCount++;
        this.apiAddHero(result);
      }
    });
  }

  /**
   * Controla el evento de click en los botones de editar heróe en cada fila
   * @param hero Héroe que se va a editar
   */
  onEditHeroClick(hero: Hero) {
    // Abrimos dialog Angular Material (creado en shared>components>DialogHeroComponent)
    const dialogRef = this.dialog.open(DialogHeroComponent, {
      width: '300px',
      data: hero
    });
    // Una vez cerrado y confirmada la edición, lo modificamos en el back-end
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiEditHero(result);
      }
    });
  }

  /**
   * Controla el evento de click en los botones de eliminar héroe en cada fila
   * @param hero Héroe que se quiere eliminar
   */
  onDeleteHeroClick(hero: Hero) {
    // Abrimos dialog Angular Material (creado en shared>components>DialogDeleteComponent)
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '250px',
      data: hero
    });
    // Esperamos a que se cierre el dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario ha seleccionado borrar el héroe, actualizamos datos y comunicamos al servicio
        this.apiDeleteHero(hero);
      }
    });
  }

  //
  //
  // API CALLS & BACK-END
  //
  //

  /**
   * Devuelve todos los héroes almacenados en el back-end simulando que se obtiene de una API
   */
  apiGetAllHeroes(): void {
    this.isLoadingData = true;
    // Llamada al servicio
    this.heroService.getAllHeroes()
      .subscribe({
        next: (data) => {
          // Actualizamos los datos obtenidos desde el servicio
          this.heroes = data;
          this.actualizarTabla();
          if (this.heroIdCount == null) {
            this.heroIdCount = this.heroes.length;
          }
          this.isLoadingData = false;
          // Mostramos en consola para comprobar que el proceso es correcto
          console.log('Héroes', this.heroes);
        },
        error: (error) => {
          this.isLoadingData = false;
          console.log(error.message)
        }
      })
  }

  /**
   * Devuelve el héroe a partir de una id proporcionada
   * @param id Id del héroes que queremos obtener
   */
  apiGetHeroById(id: number): void {
    this.isLoadingData = true;
    // Llamada al servicio
    this.heroService.getHeroById(id)
      .subscribe({
        next: (data) => {
          this.isLoadingData = false;
          // Como no se pide hacer nada con dicho héroe, simplemente lo mostramos por consola
          console.log(data);
        },
        error: (error) => {
          this.isLoadingData = false;
          console.log(error.message)
        }
      })
  }

  /**
   * Actualiza la tabla para mostrar los héroes cuyo nombre coincide con el string propocionado
   * @param str String que deben incluir los héroes en su nombre
   */
  apiGetHeroesByString(str: string): void {
    // Llamada al servicio
    this.heroService.getHeroesByString(str, this.dataSource)
      .subscribe({
        next: (data) => {
          // Cuando se complete este observable sabremos que la llamada al back-end ha sido realizada correctamente
          // No hay que realizar ningun paso adicional al hacerlo directamente con Angular material
        },
        error: (error) => {
          console.log(error.message)
        }
      })
  }

  /**
   * Añade un héroe a la lista de héroes del back-end
   * @param hero Héroe a añadir
   */
  apiAddHero(hero: Hero): void {
    this.isLoadingData = true;
    // Llamada al servicio
    this.heroService.addHero(hero)
    .subscribe({
      next: () => {
        // Cuando se complete este observable sabremos que la llamada al back-end ha sido realizada correctamente
        // Obtenemos los datos actualizados del servicio. En un caso normal, esta llamada duplicada a una API no se haría,
        // pero se utiliza en la prueba para reflejar que el servicio ha actualizado los datos correctamente del back-end falso.
        this.apiGetAllHeroes();
        this.isLoadingData = false;
        },
        error: (error) => {
          this.isLoadingData = false;
          console.log(error.message)
        }
      })
  }

  /**
   * Edita el héroe propocionado en la lista de héroes del back-end
   * @param hero Héroe a modificar
   */
  apiEditHero(hero: Hero): void {
    this.isLoadingData = true;
    // Llamada al servicio
    this.heroService.updateHero(hero)
    .subscribe({
      next: () => {
        // Cuando se complete este observable sabremos que la llamada al back-end ha sido realizada correctamente
        // Obtenemos los datos actualizados del servicio. En un caso normal, esta llamada duplicada a una API no se haría,
        // pero se utiliza en este caso para reflejar que el servicio ha actualizado los datos correctamente del back-end falso.
        this.apiGetAllHeroes();
        this.isLoadingData = false;
        },
        error: (error) => {
          this.isLoadingData = false;
          console.log(error.message)
        }
      })
  }

  /**
   * Elimina el héroe proporcionado de la lista de héroes del back-end
   * @param hero Héroe a eliminar
   */
  apiDeleteHero(hero: Hero): void {
    this.isLoadingData = true;
    // Llamada al servicio
    this.heroService.deleteHero(hero)
    .subscribe({
      next: () => {
        // Cuando se complete este observable sabremos que la llamada al back-end ha sido realizada correctamente

        // Obtenemos los datos actualizados del servicio. En un caso normal, esta llamada duplicada a una API no se haría,
        // pero se utiliza en este caso para reflejar que el servicio ha actualizado los datos correctamente del back-end falso.
        this.isLoadingData = false;
        this.apiGetAllHeroes();
        },
        error: (error) => {
          this.isLoadingData = false;
          console.log(error.message)
        }
      })
  }

  //
  //
  // FUNCIONES AUXILIARES
  //
  //

  /**
   * Actualiza los datos de la tabla de Angular Material
   */
  actualizarTabla() {
    this.dataSource = new MatTableDataSource(this.heroes);
    this.dataSource.paginator = this.paginator;
  }
}
