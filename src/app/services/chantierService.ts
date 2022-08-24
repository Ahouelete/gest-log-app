
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface credential {
    userNameorEmail: string,
    password: string
}
@Injectable()
export class ChantierService {

    constructor(private http: HttpClient, private router: Router) { }
    url = environment.backend + '/chantier'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    create(chantier: Object) {
        return this.http.post(`${this.url}/add`, chantier)
    }

    update(chantier: Object) {
        return this.http.put(`${this.url}/update`, chantier)
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }

    allChantiersEnCours(): Observable<Object> {
        return this.http.get(`${this.url}/allChantierEnCours`)
    }
}
