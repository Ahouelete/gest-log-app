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
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    url = environment.backend + '/auth'
    urlUser = environment.backend + '/users'
    
    signIn(credential: credential): Observable<Object> {
        return this.http.post(`${this.url}/signIn`, credential)
    }

    signOut() {
        window.sessionStorage.removeItem('token')
        window.sessionStorage.clear()
        window.location.href = '/login'
    }

    getUserById(id: number): Observable<Object> {
        return this.http.get(`${this.urlUser}/${id}`)
    }

    updateProfil(profil: Object): Observable<Object> {
        return this.http.put(`${this.urlUser}/update-profile`, profil)
    }
}