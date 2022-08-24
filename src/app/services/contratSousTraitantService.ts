
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ContratSousTraitantService {
    
    constructor(private http: HttpClient, private router: Router) { }
    url = environment.backend + '/contrat-sous-traitant'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    create(contrat: Object) {
        return this.http.post(`${this.url}/add`, contrat)
    }

    update(contrat: Object) {
        return this.http.put(`${this.url}/update`, contrat)
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }
}
