import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MECEFService } from 'src/app/services/mecefService';
import { PieceDaoService } from 'src/app/services/pieceDaoService';
import { SocieteService } from 'src/app/services/societeService';

@Component({
  selector: 'app-parametre-societe',
  templateUrl: './parametre-societe.component.html',
  styleUrls: ['./parametre-societe.component.css']
})

export class ParametreSocieteComponent implements OnInit {
  mecefForm!: FormGroup
  societeForm!: FormGroup
  pieceDaoForm!: FormGroup
  typeMsg = ""
  msg = ""
  listNatureActivite = [
    {
      value: 'AUTRES'
    },
    {
      value: 'IMPORTS/EXPORTS'
    },
    {
      value: 'TRANSPORTS'
    },
    {
      value: 'NEGOCES'
    }
  ]
  listRegime = [
    {
      value: 'MICRO-ENTREPRISE'
    },
    {
      value: 'PETITE ENTREPRISE'
    },
    {
      value: 'MOYENNE ENTREPRISE'
    },
    {
      value: 'GRANDE ENTREPRISE'
    }
  ]
  listFormeJuridique = [
    {
      value: 'ENTREPRISE INDIVIDUELLE'
    },
    {
      value: 'SARL'
    },
    {
      value: 'SA'
    },
    {
      value: 'AUTRES'
    }
  ]

  constructor(private fb: FormBuilder, private _mecefService: MECEFService,
    private _societeService: SocieteService, private pieceDaoService: PieceDaoService) { }

  ngOnInit(): void {
    this.createFormMecef()
    this.createPieceDaoForm()
    this.getInfo()
    this.createFormSociete()
    this.getInfoSociete()
  }

  createPieceDaoForm() {
    this.pieceDaoForm = this.fb.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(10)]],
      designation: [null, [Validators.required, Validators.maxLength(100)]]
    })
  }
  save(formaData: any) {
    this._mecefService.save(formaData).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.mecefForm.setValue(data.data[0])
          this.msg = 'Les Informations e-MECeF ont été mises à jour avec succès.'
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

  saveSociete(formaData: any) {
    this._societeService.save(formaData).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.societeForm.setValue(data.data[0])
          this.msg = 'Les Informations relatives à la société sont mises à jour avec succès.'
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

  getInfo() {
    this._mecefService.get().subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          if (data.data[0]) {
            this.mecefForm.setValue(data.data[0])
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

  getInfoSociete() {
    this._societeService.get().subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          if (data.data[0]) {
            this.societeForm.setValue(data.data[0])
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

  createFormMecef() {
    this.mecefForm = this.fb.group({
      id: [null],
      nim: [null, [Validators.required, Validators.maxLength(100)]],
      adresse: [null, [Validators.required, Validators.maxLength(100)]],
      contact: [null, [Validators.required, Validators.maxLength(100)]],
      dateExpJwt: [null, [Validators.required]],
      urlApiMECEF: [null, [Validators.required]],
      etat: [null, [Validators.required]],
      jwtToken: [null, [Validators.required]],
    })
  }

  addPieceDao(formData: any) {
    this.pieceDaoService.create(formData).subscribe({
      next: (data: any) => {
        if (data.description == "success") {
          this.typeMsg = 'success'
          this.msg = "La pièce " + formData.code + " " + formData.designation + " a été insérée avec succès!"
          this.pieceDaoForm.reset()
        } else {
          // message en cas d'erreur
          this.typeMsg = 'error'
          this.msg = data.message.detail ? data.message.detail : data.message
        }
      },
      error: (error: any) => {
        this.typeMsg = 'error'
          this.msg = error
      },
      complete: () => {
        console.log("execution complete")
      }
    })
  }

  onDisplayModalPieceDao() {
    this.pieceDaoForm.reset()
    this.typeMsg = ""
    const containerOverflow = document.querySelector('.modal-piece-dao-overlay') as HTMLElement
    const containerModal = document.querySelector('.modal-piece-dao-content') as HTMLElement
    containerOverflow.classList.toggle('active')
    containerModal.classList.toggle('active')
  }

  createFormSociete() {
    this.societeForm = this.fb.group({
      id: [1],
      raisonSociale: [null, [Validators.required, Validators.maxLength(200)]],
      rccm: [null],
      dateCreation: [null],
      ifu: [null],
      adresse: [null, [Validators.required]],
      tel1: [null],
      tel2: [null],
      email: [null],
      siteInternet: [null],
      regime: [null],
      natureActivite: [null],
      activitePrincipale: [null],
      activiteSecondaire: [null],
      formeJuridique: [null],
      logo: [null],
      capital: [null],
    })
  }

  compareFn(o1: any, o2: any) {
    return (o1 && o2 ? o1.id === o2.id : o1 === o2);
  }
}
