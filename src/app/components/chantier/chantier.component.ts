import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { ChantierService } from 'src/app/services/chantierService';
import { DaoService } from 'src/app/services/daoService';
import { MarcheService } from 'src/app/services/marcheService';
import { MetaDonneeService } from 'src/app/services/metaDonneeService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-chantier',
  templateUrl: './chantier.component.html',
  styleUrls: ['./chantier.component.css']
})
export class ChantierComponent implements OnInit {
  statutChantiers = [
    {
      value: 'EN COURS'
    },
    {
      value: 'ARRET DEFINITIF'
    },
    {
      value: 'ARRET PROVISOIRE'
    },
    {
      value: 'RECEPTION DEFINITIVE'
    },
    {
      value: 'RECEPTION PROVISOIRE'
    }
  ]
  element_deleted: any
  displayedColumns: string[] = ['#', 'dateDebContrat', 'dateFinContrat', 'code', 'designation', 'marche', 'statut', 'actions'];
  dataSource!: MatTableDataSource<any>;
  chantierForm: FormGroup | any
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  selectedValue!: string
  dateFormat = new Intl.DateTimeFormat('en-US')
  chantierEncours: any = []
  marchesEnCours: any = []
  temporis = 0
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit() {
    this.createForm()
    this.getallMarcheEnCours()
    this.all()
  }


  constructor(private _fbuilder: FormBuilder, private _authService: AuthService,
    private _marcheService: MarcheService, private metaData: MetaDonneeService,
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
      this._chantierService.update(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.all()
            this.resetchantierForm()
            this.typeMsg = 'success'
            this.msg = "Le chantier " + formData.code + " " + formData.designation + " a été modifié avec succès!"

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
      this._chantierService.create(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.all()
            this.resetchantierForm()
            this.typeMsg = 'success'
            this.msg = "Le chantier " + formData.code + " " + formData.designation + " a été enregistré avec succès!"

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
    this.chantierEncours = [...[], formData.marche]
    this.chantierForm.setValue(formData)
    this.action = "ON_UPDATE"

    const datenow = new Date().getTime()
    const dateDebut = this.chantierForm.controls['dateContratOuv'].value
    const dateFin = this.chantierForm.controls['dateContratClot'].value
    const dateTimeDeb = new Date(dateDebut)
    const dateTimeFin = new Date(dateFin)
    let dureeContrat = dateTimeFin.getTime() - dateTimeDeb.getTime()
    let joursEcoules = datenow - dateTimeDeb.getTime()
    dureeContrat = dureeContrat < 0 ? 0 : dureeContrat
    joursEcoules = joursEcoules < 0 ? 0 : joursEcoules
    this.temporis = dureeContrat == 0 ? 0 : Math.round((joursEcoules / dureeContrat) * 100)
    let jaugeTemporis = document.querySelector("#jauge-real-temporis") as HTMLElement
    jaugeTemporis.style.background = "linear-gradient(to left, rgb(113 113 113) "+ (100 - this.temporis)+"%, #009b72 +"+(this.temporis)+"%)" 
  }

  deleteCategorie(formData: any) {
    if (formData) {
      this._chantierService.delete(formData.id).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            // Supprimer avec succes
            this.element_deleted = null
            this.all()
            this.resetchantierForm()
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

  resetchantierForm() {
    this.getallMarcheEnCours()
    this.action = "ON_CREATE"
    this.chantierForm.reset()
  }

  createForm() {
    this.chantierForm = this._fbuilder.group({
      id: [null],
      code: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
      designation: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      dateContratOuv: [null, [Validators.required]],
      dateContratClot: [null, [Validators.required]],
      dateOuvReel: [null],
      dateClotReel: [null],
      dateRecepProv: [null],
      dateRecepDef: [null],
      responsable: [null, [Validators.maxLength(100)]],
      autresInfo: [null],
      statut: [null, [Validators.required]],
      marche: [null, [Validators.required]]
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
    this._chantierService.all().subscribe({
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
          message: 'Etes-vous sur de vouloir supprimer ce chantier ?',
          btnActionValid: 'Supprimer'
        }
      });
    this.element_deleted = formData
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.element_deleted) {
        this.deleteCategorie(this.element_deleted)
      }
    });
  }

  getallMarcheEnCours() {
    this._marcheService.allMarcheEnCours().subscribe({
      next: (data: any) => {
        this.marchesEnCours = data.data
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