
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class MECEFService {
    
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/info-mecef'

    get(): Observable<Object> {
        return this.http.get(`${this.url}/get`)
    }

    save(object: Object) {
        return this.http.post(`${this.url}/save`, object)
    }
}
