
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
export class DaoService {
    
    constructor(private http: HttpClient, private router: Router) { }
    url = environment.backend + '/dao'

    allDaoWinWithoutMarche(): Observable<Object> {
        return this.http.get(`${this.url}/allDaoWinWithoutMarche`)
    }

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    create(dao: Object) {
        return this.http.post(`${this.url}/add`, dao)
    }

    getDaoByStatut(idStatut: number): Observable<Object> {
        return this.http.get(`${this.url}/stautdao/${idStatut}`)
    }
    update(dao: Object) : Observable<any> {
        return this.http.put(`${this.url}/update`, dao)
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }

    allPieceAFournir(): Observable<Object>{
        return this.http.get(`${environment.backend}/piecedao/all`)
    }
}
