import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ReglementFactureMarcheService {

    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/reglementfacturemarche'


    reglerFacture(reglement: Object): Observable<Object> {
        return this.http.post(`${this.url}/regler-facture`, reglement)
    }

    allReglement(clientId: string, statutInvoice: string): Observable<Object> {
        return this.http.get(`${this.url}/all/${clientId}/${statutInvoice}`)
    }

    allClientInvoice() : Observable<Object> {
        return this.http.get(`${this.url}/allClientInvoice`)
    }
}

