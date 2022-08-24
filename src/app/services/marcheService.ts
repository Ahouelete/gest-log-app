import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class MarcheService {
    
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/marche'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    create(marche: Object) {
        return this.http.post(`${this.url}/add`, marche)
    }

    getDaoByStatut(idStatut: number): Observable<Object> {
        return this.http.get(`${this.url}/stautMarche/${idStatut}`)
    }

    update(marche: Object) {
        return this.http.put(`${this.url}/update`, marche)
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }
    allMarcheWinWithoutFactureMarche(): Observable<Object> {
        return this.http.get(`${this.url}/allMarcheWinWithoutFactureMarche`)
    }

    allMarcheEnCours(): Observable<Object> {
        return this.http.get(`${this.url}/allMarcheEnCours`)
    }
    
}
