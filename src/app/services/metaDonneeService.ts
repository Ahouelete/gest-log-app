
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export interface credential {
    userNameorEmail: string,
    password: string
}
@Injectable()
export class MetaDonneeService {
    
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend

    allStatutDao(): Observable<Object> {
        return this.http.get(`${this.url}/statutDao/all`)
    }

    allStatutMarche(): Observable<Object> {
        return this.http.get(`${this.url}/statutMarche/all`)
    }
    
    allTypeFinancement(): Observable<Object> {
        return this.http.get(`${this.url}/typeFinancement/all`)
    }
    allModeReglement(): Observable<Object> {
        return this.http.get(`${this.url}/modereglement/all`)
    }
    
}
