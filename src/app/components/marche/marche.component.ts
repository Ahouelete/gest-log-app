import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { DaoService } from 'src/app/services/daoService';
import { MarcheService } from 'src/app/services/marcheService';
import { MetaDonneeService } from 'src/app/services/metaDonneeService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-marche',
  templateUrl: './marche.component.html',
  styleUrls: ['./marche.component.css']
})
export class MarcheComponent implements OnInit {

  element_deleted: any
  displayedColumns: string[] = ['#', 'code', 'designation', 'financement', 'montantMarche', 'statutMarche', 'actions'];
  dataSource!: MatTableDataSource<any>;
  marcheForm: FormGroup | any
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  listStatutDAO: any
  selectedValue!: string
  numberFormat = new Intl.NumberFormat()
  dateFormat = new Intl.DateTimeFormat('en-US')
  daos: any = []
  typeFinancements: any = []
  statutMarches: any = []
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit() {
    this.createForm()
    this.getAllStatutMarche()
    this.getAllTypeFinanacement()
    this.getAllDaoWinWithoutMarche()
    this.all()
  }


  constructor(private _fbuilder: FormBuilder, private _authService: AuthService,
    private _marcheService: MarcheService, private metaData: MetaDonneeService,
    public dialog: MatDialog, private daoService: DaoService
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
  onChangeValue() {
    const dao = this.marcheForm.value['dao']
    if (dao) {
      this.marcheForm.controls['montantGlobal'].setValue(dao.montantAccepte)
      this.marcheForm.controls['montantFacture'].setValue(dao.montantAccepte)
    }
    else {
      this.marcheForm.controls['montantGlobal'].setValue(0)
      this.marcheForm.controls['montantFacture'].setValue(0)
    }
  }

  update(formData: any) {
    if (formData) {
      this._marcheService.update(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "Le marché " + formData.code + " " + formData.designation + " a été modifié avec succès!"
            this.all()
            this.resetmarcheForm()
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
      this._marcheService.create(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "Le marché " + formData.code + " " + formData.designation + " a été enregistré avec succès!"
            this.getAllDaoWinWithoutMarche()
            this.all()
            this.resetmarcheForm()
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
    this.daos = [...[], formData.dao]
    delete formData.estEntierementFacture
    this.marcheForm.setValue(formData)
    this.action = "ON_UPDATE"
  }

  deleteCategorie(formData: any) {
    if (formData) {
      this._marcheService.delete(formData.id).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            // Supprimer avec succes
            this.typeMsg = 'success'
            this.msg = "Le marché " + formData.code + " " + formData.designation + " a été supprimé avec succès!"
            this.element_deleted = null
            this.all()
            this.resetmarcheForm()
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

  resetmarcheForm() {
    this.getAllDaoWinWithoutMarche()
    this.action = "ON_CREATE"
    this.marcheForm.reset()
  }

  createForm() {
    this.marcheForm = this._fbuilder.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
      designation: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      maitreOuvrage: [null, [Validators.required, Validators.maxLength(100)]],
      travaux: [null, [Validators.required, Validators.maxLength(100)]],
      bailleur1: [null],
      tauxBailleur1: [0, [Validators.max(100)]],
      montantBailleur1: [0],
      bailleur2: [null],
      tauxBailleur2: [0, [Validators.max(100)]],
      montantBailleur2: [0],
      bailleur3: [null],
      tauxBailleur3: [0, [Validators.max(100)]],
      montantBailleur3: [0],
      montantGlobal: [0],
      montantFacture: [0],
      montantPayer: [0],
      resteAPayer: [0],
      tauxRealisation: [0],
      typeFinancement: [null, [Validators.required]],
      statutMarche: [null, [Validators.required]],
      dao: [null, [Validators.required]]
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
    this._marcheService.all().subscribe({
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
          message: 'Etes-vous sur de vouloir supprimer ce marché ?',
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

  getAllStatutMarche() {
    this.metaData.allStatutMarche().subscribe({
      next: (data: any) => {
        this.statutMarches = data
      },
      error: (error: any) => {},
      complete: () => {

      }
    })
  }

  getAllTypeFinanacement() {
    this.metaData.allTypeFinancement().subscribe({
      next: (data: any) => {
        this.typeFinancements = data
      },
      error: (error: any) => {

      },
      complete: () => {

      }
    })
  }

  getAllDaoWinWithoutMarche() {
    this.daoService.allDaoWinWithoutMarche().subscribe({
      next: (data: any) => {
        this.daos = data.data
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