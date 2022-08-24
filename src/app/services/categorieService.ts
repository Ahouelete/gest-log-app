
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
export class CategorieService {
    
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/categoriearticle'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    create(categorie: Object) {
        return this.http.post(`${this.url}/add`, categorie)
    }

    update(categorie: Object) {
        return this.http.put(`${this.url}/update`, categorie)
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }
}
