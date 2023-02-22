import { MatTableDataSource } from '@angular/material/table';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  //
  //
  // VARIABLES
  //
  //

  /**
   * Datos para la simulación del back-end
   */
  heroes: Hero[] = [
    { id: 1, name: 'Spiderman', colors: 'Rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/133.jpg?v=1615880202'},
    { id: 2, name: 'Superman', colors: 'Azul, rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/791.jpg?v=1610931347'},
    { id: 3, name: 'Hulk', colors: 'Verde, morado', image: 'https://www.superherodb.com/pictures2/portraits/10/050/83.jpg?v=1602211487'},
    { id: 4, name: 'Iron Man', colors: 'Amarillo, rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/85.jpg?v=1620109106'},
    { id: 5, name: 'Black Panther', colors: 'Negro', image: 'https://www.superherodb.com/pictures2/portraits/10/050/247.jpg?v=1600426699'},
    { id: 6, name: 'Batman', colors: 'Negro', image: 'https://www.superherodb.com/pictures2/portraits/10/050/639.jpg?v=1636115377'},
    { id: 7, name: 'Lobezno', colors: 'Amarillo, azul', image: 'https://www.superherodb.com/pictures2/portraits/10/050/161.jpg?v=1605762552'},
    { id: 8, name: 'Thor', colors: 'Negro, rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/140.jpg?v=1631100159'},
    { id: 9, name: 'Capitán América', colors: 'Azul, rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/274.jpg?v=1617662218'},
    { id: 10, name: 'Deadpool', colors: 'Rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/835.jpg?v=1574161885'},
    { id: 11, name: 'Flash', colors: 'Rojo', image: 'https://www.superherodb.com/pictures2/portraits/10/050/690.jpg?v=1602456316'},
    { id: 12, name: 'Green Lantern', colors: 'Verde', image: 'https://www.superherodb.com/pictures2/portraits/10/050/697.jpg?v=1596362255'},
  ];

  /**
   * Timeout que simulará lo que tardan en cargarse las llamadas al back-end falso
   */
  timeoutMockup: number = 400;

  //
  //
  // CONSTRUCTOR
  //
  //

  /**
   * Constructor HeroService
   * @param http servicio inyectado que permite realizar llamadas HTTP
   */
  constructor(protected http: HttpClient) {}

  //
  //
  // LLAMADAS SERVICIO
  //
  //

  /**
   * Devuelve todos los héroes de la BD
   * @returns Array de héroes
   */
  getAllHeroes(): Observable<Hero[]> {
    // Mock-up si se comunicase con una API REST:
    // return this.http.get<Hero[]>(`http://localhost:3000/heroes`);

    // Simulamos observable con timeout como si hubiesemos hecho una llamada a una API REST
    let obs = new Observable<Hero[]>((subscriber) => {
      setTimeout(()=>{
        // Devolvemos la lista de heroes
        let response = this.heroes;
        // Finalizamos llamada
        if (response != null) {
          subscriber.next(response);
        } else {
          subscriber.error(new Error("Error: no se han podido devolver los heroes."));
        }
        subscriber.complete();
      }, this.timeoutMockup);
    });
    return obs;
  }

  /**
   * Devuelve un heroe de la BD por id
   * @param id id del heroe a consultar
   * @returns heroe con todos sus detalles
   */
  getHeroById(id: number): Observable<Hero> {
    // Mock-up si se comunicase con una API REST:
    // return this.http.get<Hero>(`http://localhost:3000/heroes?id=${id}`);

    // Simulamos observable con timeout como si hubiesemos hecho una llamada a una API REST
    let obs = new Observable<Hero>((subscriber) => {
      setTimeout(()=>{
        // Devolvemos la lista de heroes
        let response = this.heroes.find(x => x.id === id);
        // Finalizamos llamada
        if (response != null) {
          subscriber.next(response);
        } else {
          subscriber.error(new Error("Error: no se ha podido devolver el heroe por id."));
        }
        subscriber.complete();
      }, this.timeoutMockup);
    });
    return obs;
  }

  /**
   * Devuelve los heroes que incluyan la cadena proporcionada en su nombre
   * @param str cadena a buscar
   * @returns heroes cuyo nombre incluyan la cadena indicada
   */
  getHeroesByString(str: string, dataSource: MatTableDataSource<Hero>): Observable<{}> {
    // Mock-up si se comunicase con una API REST:
    // return this.http.get<Hero[]>(`http://localhost:3000/heroes?str=${str}`);

    // Simulamos observable con timeout como si hubiesemos hecho una llamada a una API REST
    let obs = new Observable<Hero>((subscriber) => {
      setTimeout(()=>{
        // Angular material proporciona una manera de filtrar directamente, por lo que no hace falta modificar los datos originales
        // Si se quisiese modificar, simplemente habría que utilizar la función filter para encontrar las coincidencias y devolverlas
        dataSource.filter = str.trim().toLowerCase();
        // Finalizamos llamada
        subscriber.next();
        subscriber.complete();
      }, 10);
    });
    return obs;
  }

  /**
   * Añade el heroe pasado por parámetro
   * @param hero Heroe que se quiere añadir
   * @returns Observable que indica si ha terminado la llamada
   */
  addHero(hero: Hero): Observable<{}> {
    // Mock-up si se comunicase con una API REST:
    // return this.http.post(`http://localhost:3000/heroes`, hero);

    // Simulamos observable con timeout como si hubiesemos hecho una llamada a una API REST
    let obs = new Observable<{}>((subscriber) => {
      setTimeout(()=>{
        // Eliminamos el heroe
        this.heroes.push(hero);
        // Finalizamos llamada
        if (this.heroes != null) {
          subscriber.next();
        } else {
          subscriber.error(new Error("Error: no se ha podido añadir el héroe."))
        }
        subscriber.complete();
      }, this.timeoutMockup);
    });
    return obs;
  }

  /**
   * Modifica los datos de un heroe
   * @param hero Heroe que se quiere modificar con los datos actualizados1
   * @returns Observable que indica si ha terminado la llamada
   */
  updateHero(hero: Hero): Observable<{}> {
    // Mock-up si se comunicase con una API REST:
    // return this.http.put(`http://localhost:3000/heroes`, hero);

    // Simulamos observable con timeout como si hubiesemos hecho una llamada a una API REST
    let obs = new Observable<{}>((subscriber) => {
      setTimeout(()=>{
        // Eliminamos el heroe
        let heroToModify: Hero | undefined = this.heroes.find(x => x.id === hero.id);
        // Finalizamos llamada
        if (heroToModify && this.heroes != null) {
          heroToModify.name = hero.name;
          heroToModify.image = hero.image;
          heroToModify.colors = hero.colors;
          subscriber.next();
        } else {
          subscriber.error(new Error("Error: no se ha podido modificar el héroe."))
        }
        subscriber.complete();
      }, this.timeoutMockup);
    });
    return obs;
  }

  /**
   * Elimina el heroe pasado por parámetro
   * @param hero Heroe a eliminar
   * @returns Observable que indica si ha terminado la llamada
   */
  deleteHero(hero: Hero): Observable<{}> {
    // Mock-up si se comunicase con una API REST:
    // return this.http.delete(`http://localhost:3000/heroes?id=${hero.id}`);

    // Simulamos observable con timeout como si hubiesemos hecho una llamada a una API REST
    let obs = new Observable<{}>((subscriber) => {
      setTimeout(()=>{
        // Eliminamos el heroe
        this.heroes.splice(this.heroes.findIndex(item => item.id === hero.id), 1);
        // Finalizamos llamada
        if (this.heroes != null) {
          subscriber.next();
        } else {
          subscriber.error(new Error("Error: no se ha podido eliminar el héroe."))
        }
        subscriber.complete();
      }, this.timeoutMockup);
    });
    return obs;
  }
}
