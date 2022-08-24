import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { TiersService } from 'src/app/services/tiersServices';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  typeTiers = {
    id: 2,
    type: 'CLIENT'
  }
  element_deleted: any
  displayedColumns: string[] = ['#', 'numero', 'intitule', 'adresse', 'ville', 'email', 'actions'];
  dataSource!: MatTableDataSource<any>;
  clientForm: FormGroup | any
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  selectedValue!: string
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit() {
    this.createForm()
    this.all()
  }


  constructor(private _fbuilder: FormBuilder, private _authService: AuthService,
    private _tiersService: TiersService,
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
      this._tiersService.update(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "Le client " + formData.numero + " " + formData.intitule + " a été modifié avec succès!"
            this.all()
            this.resetclientForm()
          } else {
            // message en cas d'erreur
            this.typeMsg = 'error'
            this.msg = data.message.detail ? data.message.detail : data.message
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
      this._tiersService.create(formData).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "Le client " + formData.numero + " " + formData.intitule + " a été enregistré avec succès!"
            this.all()
            this.resetclientForm()
          } else {
            // message en cas d'erreur
            this.typeMsg = 'error'
            this.msg = data.message.detail ? data.message.detail : data.message
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
    this.clientForm.setValue(formData)
    this.action = "ON_UPDATE"
  }

  delete(formData: any) {
    if (formData) {
      this._tiersService.delete(formData.id).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            // Supprimer avec succes
            this.typeMsg = 'success'
            this.msg = "Le client " + formData.numero + " " + formData.intitule + " a été supprimé avec succès!"
            this.element_deleted = null
            this.all()
            this.resetclientForm()
          } else {
            this.typeMsg = 'error'
            this.msg = data.message.detail ? data.message.detail : data.message
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

  resetclientForm() {
    this.action = "ON_CREATE"
    this.clientForm.reset()
    this.clientForm.controls['typeTiers'].setValue(this.typeTiers)
  }
  createForm() {
    this.clientForm = this._fbuilder.group({
      id: [null],
      ifu: [null, Validators.pattern('[0-9]{13}')],
      numero: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
      intitule: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      adresse: [null, [Validators.required, Validators.maxLength(100)]],
      region: [null, [Validators.required, Validators.maxLength(100)]],
      ville: [null, [Validators.required, Validators.maxLength(100)]],
      telephone1: [null, [Validators.maxLength(10)]],
      telephone2: [null, [Validators.maxLength(10)]],
      email: [null],
      site: [null],
      autresInfos: [null, [Validators.max(250)]],
      typeTiers: [this.typeTiers]
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
    this._tiersService.getallTiersByType(this.typeTiers.id).subscribe({
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
          message: 'Etes-vous sur de vouloir supprimer ce client ?',
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

  compareFn(o1: any, o2: any) {
    return (o1 && o2 ? o1.id === o2.id : o1 === o2);
  }
}