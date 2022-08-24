import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authService';
import { GlobalService } from 'src/app/services/globalService';
import { MECEFService } from 'src/app/services/mecefService';

@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-user.component.html',
  styleUrls: ['./profil-user.component.css']
})
export class ProfilUserComponent implements OnInit {
  profilForm!: FormGroup
  typeMsg = ""
  msg = ""

  constructor(private fb: FormBuilder, private _globalService: GlobalService, private userService : AuthService) { }

  ngOnInit(): void {
    this.createFormProfil()
    this.getProfil()
  }

  save(formaData: any) {
    this.userService.updateProfil(formaData).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.profilForm.setValue(data.data)
          this.msg = 'Votre compte a été mise à jour avec succès.'
          this.typeMsg = 'success'
        } else {
          this.msg = data.message.detail ? data.message.detail : data.message
          this.typeMsg = 'error'
        }
      },
      error: (error: HttpErrorResponse) => {
        this.msg = error.message
        this.typeMsg = 'error'
      },
      complete: () => {
        console.log('Execution complete')
      }
    })
  }
  getProfil() {
    const user = this._globalService.getCurrentUser()
    this.userService.getUserById(user.userId).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          if (data.data){
            this.profilForm.setValue(data.data)
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this.msg = error.message
        this.typeMsg = 'error'
      },
      complete: () => {
        console.log('Execution complete')
      }
    })
  }

  createFormProfil() {
    this.profilForm = this.fb.group({
      id: [null],
      userName: [null, [Validators.required, Validators.maxLength(100)]],
      nom: [null, [Validators.required, Validators.maxLength(100)]],
      prenoms: [null, [Validators.required, Validators.maxLength(100)]],
      email: [null],
      telephone1: [null,],
      telephone2: [null, ],
      adresse: [null],
      ville: [null],
      pays: [null],
      autresInfos: [null]
    })
  }

}
