import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class FactureMarcheService {
    
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/facturemarche'

    all(): Observable<Object> {
        return this.http.get(`${this.url}/all`)
    }

    generateFacture(facture: Object) {
        return this.http.post(`${this.url}/generate`, facture)
    }
    normaliserFcature(facture: Object) {
        return this.http.put(`${this.url}/normaliserfacture`, facture)
    }
    
    downloadInvoice(invoice : Object){
        return this.http.post(`${this.url}/printInvoice`, invoice)
    }
}
