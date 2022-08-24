
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class PieceDaoService {
    
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/piecedao'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    create(pieceDao: Object) {
        return this.http.post(`${this.url}/add`, pieceDao)
    }

    update(pieceDao: Object) {
        return this.http.put(`${this.url}/update`, pieceDao)
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }
}
