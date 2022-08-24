import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { FamilleService } from 'src/app/services/familleService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-famille-article',
  templateUrl: './famille-article.component.html',
  styleUrls: ['./famille-article.component.css']
})
export class FamilleArticleComponent implements OnInit {
  element_deleted: any
  displayedColumns: string[] = ['#', 'code', 'intitule', 'actions'];
  dataSource!: MatTableDataSource<any>;
  familleForm: FormGroup | any
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit() {
    this.createForm()
    this.all()
  }

  constructor(private _fbuilder: FormBuilder, private _authService: AuthService,
    private _familleService: FamilleService,
    public dialog: MatDialog
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
      this._familleService.update(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "La famille " + formData.code + " " + formData.intitule + " a été modifiée avec succès!"
            this.all()
            this.resetfamilleForm()
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
      this._familleService.create(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "La famille " + formData.code + " " + formData.intitule + " a été enregistrée avec succès!"
            this.all()
            this.resetfamilleForm()
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

  onUpdate(formData: object) {
    this.familleForm.setValue(formData)
    this.action = "ON_UPDATE"
  }

  deleteCategorie(formData: any) {
    if (formData) {
      this._familleService.delete(formData.id).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            // Supprimer avec succes
            this.typeMsg = 'success'
            this.msg = "La famille " + formData.code + " " + formData.intitule + " a été supprimée avec succès!"
            this.element_deleted = null
            this.all()
            this.resetfamilleForm()
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

  resetfamilleForm() {
    this.action = "ON_CREATE"
    this.familleForm.reset()
  }
  createForm() {
    this.familleForm = this._fbuilder.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
      intitule: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]]
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
    this._familleService.all().subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.dataSource = new MatTableDataSource(data.data)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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
          message: 'Etes-vous sur de vouloir supprimer cette famille d\'article ?',
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
}

