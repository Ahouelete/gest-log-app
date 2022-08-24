import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { DaoService } from 'src/app/services/daoService';
import { FactureMarcheService } from 'src/app/services/factureMarcheService';
import { MarcheService } from 'src/app/services/marcheService';
import { MetaDonneeService } from 'src/app/services/metaDonneeService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-facture-marches',
  templateUrl: './list-facture-marches.component.html',
  styleUrls: ['./list-facture-marches.component.css']
})
export class ListFactureMarchesComponent implements OnInit {
  displayedColumns: string[] = ['#', 'code', 'designation', 'financement', 'montantFacturer', 'montantMarche', 'actions'];
  displayedColumnssource: string[] = ['#', 'date', 'reference', 'montant', 'statut', 'marche', 'actions'];
  dataSource!: MatTableDataSource<any>;
  listMarcheWithoutFcture!: MatTableDataSource<any>;
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  numberFormat = new Intl.NumberFormat()
  dateFormat = new Intl.DateTimeFormat('en-US')
  daos: any = []
  currentMarche: any
  taxForm!: FormGroup
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginatorsource!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortsource!: MatSort;

  ngOnInit() {
    this.createTaxForm()
    this.allMarcheWithoutFacture()
    this.allFactureMarche()
  }


  constructor(private _authService: AuthService,
    private _marcheService: MarcheService, private metaData: MetaDonneeService,
    public dialog: MatDialog, private daoService: DaoService,
    private _factureMarcheService: FactureMarcheService, private _fb: FormBuilder
  ) {

  }

  applyFiltersource(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listMarcheWithoutFcture.filter = filterValue.trim().toLowerCase();

    if (this.listMarcheWithoutFcture.paginator) {
      this.listMarcheWithoutFcture.paginator.firstPage();
    }
  }

  onDisplayModal() {
    const containerOverflow = document.querySelector('.modal-generate-overlay') as HTMLElement
    const containerModal = document.querySelector('.modal-generate-content') as HTMLElement
    containerOverflow.classList.toggle('active')
    containerModal.classList.toggle('active')
  }


  allMarcheWithoutFacture() {
    this._marcheService.allMarcheWinWithoutFactureMarche().subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.listMarcheWithoutFcture = new MatTableDataSource(data.data)
          this.listMarcheWithoutFcture.paginator = this.paginatorsource;
          this.listMarcheWithoutFcture.sort = this.sortsource;
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
  onGenerateInvoice(formData: any) {
    this.currentMarche = formData
    this.taxForm.reset()
    this.onDisplayModal()
  }

  allFactureMarche() {
    this._factureMarcheService.all().subscribe({
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
          message: 'Etes-vous sur de vouloir normaliser cette facture provisoire ?',
          btnActionValid: 'Bien sûr !'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        // processus de normalisation de facture.......
        // essai de normalisation
        const modal = document.getElementById('modal-normalise') as HTMLElement
        modal.style.display = 'block'

        this.normaliserFactureForMarche(formData)
        // fin normaliation
      }
    });
  }
  generateFacture() {
    this.onDisplayModal()
    this.confirmGenerate()
  }
  confirmGenerate() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          message: 'Etes-vous sûr de vouloir générer la facture pour ce marché ?',
          btnActionValid: 'Générer'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const modal = document.getElementById('modal-generate') as HTMLElement
        modal.style.display = 'block'
        this.generateFactureForMarche(this.currentMarche)
      }
    });
  }
  
  generateFactureForMarche(formData: any) {
    const invoice = formData
    const taxFormValue = this.taxForm.value
    invoice.taux_AIB = taxFormValue.has_AIB ? 5 : 0
    invoice.tax_TVA = taxFormValue.has_TVA ? 18 : 0
    invoice.remise = taxFormValue.hasRemise
    invoice.desgnOperation = taxFormValue.desgnOperation
    invoice.montantFacture = taxFormValue.montantFacture

    this._factureMarcheService.generateFacture(invoice).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.allMarcheWithoutFacture()
          this.allFactureMarche()
          this.msg = "La facture a été générée avec succès pour ce marché"
          this.typeMsg = "success"
        } else {
          this.msg = data.message
          this.typeMsg = "error"
        }
      },
      error: (error: any) => {
        this.msg = error.details
        this.typeMsg = "error"
      },
      complete: () => {
        const modal = document.getElementById('modal-generate') as HTMLElement
        modal.style.display = 'none'
      }
    })
  }

  createTaxForm() {
    this.taxForm = this._fb.group({
      has_AIB: [false],
      has_TVA: [false],
      hasRemise: [{ value: 0 }],
      montantFacture: [{ value: 0 }, [Validators.required]],
      desgnOperation: [null]
    })
  }

  normaliserFactureForMarche(formData: any) {
    this._factureMarcheService.normaliserFcature(formData).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.allFactureMarche()
          this.msg = "La facture a été normalisée avec succès"
          this.typeMsg = "success"
        } else {
          this.msg = data.message
          this.typeMsg = "error"
        }
      },
      error: (error: any) => {
        this.msg = error.details
        this.typeMsg = "error"
      },
      complete: () => {
        const modal = document.getElementById('modal-normalise') as HTMLElement
        modal.style.display = 'none'
      }
    })
  }

  compareFn(o1: any, o2: any) {
    return (o1 && o2 ? o1.id === o2.id : o1 === o2);
  }

  refresh() {
    this.allFactureMarche()
    this.allMarcheWithoutFacture()
  }

  downloadFile(formData: any) {
    this._factureMarcheService.downloadInvoice(formData).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          var byteCharacters = atob(data.data);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var file = new Blob([byteArray], { type: 'application/pdf;base64' });

          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
      complete: () => {
        console.log("download terminé");
      }
    }
    );
  }
}