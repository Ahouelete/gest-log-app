
import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class TiersService {
    
    constructor(private http: HttpClient, private router: Router) { }
    url = environment.backend + '/tiers'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }
    create(tier: Object) {
        return this.http.post(`${this.url}/add`, tier)
    }
    getallTiersByType(idType: number): Observable<Object> {
        return this.http.get(`${this.url}/byTypeTiers/${idType}`)
    }
    update(tier: Object) {
        return this.http.put(`${this.url}/update`, tier)
    }
    delete(id: number) {
        return this.http.delete(`${this.url}/delete/${id}`)
    }
}
