import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { ChantierService } from 'src/app/services/chantierService';
import { ContratSousTraitantService } from 'src/app/services/contratSousTraitantService';
import { TiersService } from 'src/app/services/tiersServices';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-contrat-sous-traitant',
  templateUrl: './contrat-sous-traitant.component.html',
  styleUrls: ['./contrat-sous-traitant.component.css']
})
export class ContratSousTraitantComponent implements OnInit {
  statutContrat = [
    {
      value: 'EN COURS'
    },
    {
      value: 'TERMINER'
    }
  ]
  element_deleted: any
  displayedColumns: string[] = ['#', 'dateDebContrat', 'code', 'designation', 'travaux', 'chantier', 'statut', 'actions'];
  dataSource!: MatTableDataSource<any>;
  contratSousTraitantForm: FormGroup | any
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  selectedValue!: string
  dateFormat = new Intl.DateTimeFormat('en-US')
  numberFormat = new Intl.NumberFormat()
  chantierEnCours: any = []
  listSousTraitants: any = []
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit() {
    this.createForm()
    this.getAllSoustraitant()
    this.getallChantierEnCours()
    this.all()
  }


  constructor(private _fbuilder: FormBuilder, private _authService: AuthService,
    private _contratSousTraitantService: ContratSousTraitantService, private _tierservice: TiersService,
    public dialog: MatDialog, private _chantierService: ChantierService
  ) {

  }

  onSave(formData: any) {
    switch (this.action) {
      case "ON_CREATE": // AJOUT DE CATEGORIE
        this.create(formData)
        break;
      case "ON_UPDATE": // MISE A JOUR DE CATEGORIE
        this.update(formData)
        break;
    }
  }

  update(formData: any) {
    if (formData) {
      this._contratSousTraitantService.update(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.all()
            this.resetcontratSousTraitantForm()
            this.typeMsg = 'success'
            this.msg = "Le contrat " + formData.code + " " + formData.designation + " a été modifié avec succès!"

          } else {
            // message en cas d'erreur
            this.typeMsg = 'error'
            this.msg = data.message
          }
        },
        error: (error) => {
          // message d'erreur a afficher
          this.typeMsg = 'error'
          this.msg = error
        },
        complete: () => {
          // execution completement terminer
          console.log('complete execution');
        }
      })
    }
  }

  create(formData: any) {
    if (formData) {
      this._contratSousTraitantService.create(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.all()
            this.resetcontratSousTraitantForm()
            this.typeMsg = 'success'
            this.msg = "Le contrat " + formData.code + " " + formData.designation + " a été enregistré avec succès!"

          } else {
            // message en cas d'erreur
            this.typeMsg = 'error'
            this.msg = data.message
          }
        },
        error: (error) => {
          // message d'erreur a afficher
          this.typeMsg = 'error'
          this.msg = error
        },
        complete: () => {
          // execution completement terminer
          console.log('complete execution');
        }
      })
    }
  }

  onUpdate(formData: any) {
    this.chantierEnCours = [...[], formData.chantier]
    this.contratSousTraitantForm.setValue(formData)
    this.action = "ON_UPDATE"
  }

  delete(formData: any) {
    if (formData) {
      this._chantierService.delete(formData.id).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            // Supprimer avec succes
            this.element_deleted = null
            this.all()
            this.resetcontratSousTraitantForm()
            this.typeMsg = 'success'
            this.msg = "Le chantier " + formData.code + " " + formData.designation + " a été supprimé avec succès!"

          } else {
            this.typeMsg = 'error'
            this.msg = data.message
          }
        },
        error: (error) => {
          // message en cas d'erreur
          this.typeMsg = 'error'
          this.msg = error
        },
        complete: () => {
          console.log('Execution terminée')
        }
      })
    }
  }

  resetcontratSousTraitantForm() {
    this.getallChantierEnCours()
    this.action = "ON_CREATE"
    this.contratSousTraitantForm.reset()
  }

  createForm() {
    this.contratSousTraitantForm = this._fbuilder.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
      designation: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      travaux: [null, [Validators.required, Validators.maxLength(200)]],
      dateDebContrat: [null, [Validators.required]],
      dateFinContrat: [null],
      montantInitial: [0],
      montantAvenant: [0],
      montantFacture: [0],
      montantPayer: [0],
      resteAPayer: [0],
      statut: [null, [Validators.required]],
      chantier: [null, [Validators.required]],
      tiers: [null, [Validators.required]]
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  all() {
    this._contratSousTraitantService.all().subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.dataSource = new MatTableDataSource(data.data)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource)
        }
      },
      error: (error) => {
        this.typeMsg = 'error'
        this.msg = error
      },
      complete: () => {
        console.log('execution complete');
      }
    })
  }

  openDialog(formData: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          message: 'Etes-vous sur de vouloir supprimer ce contrat ?',
          btnActionValid: 'Supprimer'
        }
      });
    this.element_deleted = formData
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.element_deleted) {
        this.delete(this.element_deleted)
      }
    });
  }

  getallChantierEnCours() {
    this._chantierService.allChantiersEnCours().subscribe({
      next: (data: any) => {
        this.chantierEnCours = data.data
      },
      error: (error: any) => {

      },
      complete: () => {

      }
    })
  }

  getAllSoustraitant() {
    this._tierservice.getallTiersByType(3).subscribe({
      next: (data: any) => {
        this.listSousTraitants = data.data
      },
      error: (error: any) => {

      },
      complete: () => {

      }
    })
  }

  compareFn(o1: any, o2: any) {
    return (o1 && o2 ? o1.id === o2.id : o1 === o2);
  }
}