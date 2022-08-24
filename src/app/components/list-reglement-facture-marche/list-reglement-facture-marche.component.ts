import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { DaoService } from 'src/app/services/daoService';
import { MarcheService } from 'src/app/services/marcheService';
import { MetaDonneeService } from 'src/app/services/metaDonneeService';
import { ReglementFactureMarcheService } from 'src/app/services/reglementFactureMarche';
import { ModalReglementInvoiceMarcheComponent } from '../modal-reglement-invoice-marche/modal-reglement-invoice-marche.component';

@Component({
  selector: 'app-list-reglement-facture-marche',
  templateUrl: './list-reglement-facture-marche.component.html',
  styleUrls: ['./list-reglement-facture-marche.component.css']
})
export class ListReglementFactureMarcheComponent implements OnInit {
  displayedColumns: string[] = ['#', 'date', 'reference', 'montant','reste', 'statut', 'marche', 'actions'];
  dataSource!: MatTableDataSource<any>;
  action = "ON_CREATE"
  msg = ''
  typeMsg = ''
  numberFormat = new Intl.NumberFormat()
  dateFormat = new Intl.DateTimeFormat('en-US')
  daos: any = []
  currentMarche: any
  countNonPayee = 0
  countPayeeEnt = 0
  countPayeePart = 0
  listClient : any = []
  clientChoice = "TOUS"
  statutChoice = "TOUS"
  listStatut = [
    {
      value: 'TOUS'
    },
    {
      value: 'ENTIEREMENT PAYEE'
    },
    {
      value: 'PARTIELLEMENT PAYEE'
    },
    {
      value: 'NON PAYEE'
    }
  ]
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;


  ngOnInit() {
    this.allClientInvoice()
    this.allFactureMarche()
  }


  constructor(private _authService: AuthService,
    private _marcheService: MarcheService, private metaData: MetaDonneeService,
    public dialog: MatDialog, private daoService: DaoService,
    private _rglementFactureMarcheService: ReglementFactureMarcheService
  ) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  allClientInvoice() {
    this._rglementFactureMarcheService.allClientInvoice().subscribe({
      next: (data: any) => {
        this.listClient = data.data
        const tous = {
          id: 'TOUS',
            numero: 'TOUS'
        }
        this.listClient.unshift(tous)
      },
      error: (error) => {

      },
      complete: () => {
        console.log('Execution Complete')
      }
    })
  }
  allFactureMarche() {
    this.countNonPayee = 0
    this.countPayeeEnt = 0
    this.countPayeePart = 0
    this._rglementFactureMarcheService.allReglement(this.clientChoice, this.statutChoice).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.dataSource = new MatTableDataSource(data.data.data)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          const option = data.data.option
          option.forEach((ele: any) => {
            if (ele.value == 'PAYER_ENTIEREMENT')
              this.countPayeeEnt = ele.stat
            if (ele.value == 'PAYER_PARTIELLEMENT')
              this.countPayeePart = ele.stat
            if (ele.value == 'NON_PAYER')
              this.countNonPayee = ele.stat
          });
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
    const dialogRef = this.dialog.open(ModalReglementInvoiceMarcheComponent,
      {
        data: {
          message: '',
          btnActionValid: '',
          invoice: formData
        }
      });
  }

  compareFn(o1: any, o2: any) {
    return (o1 && o2 ? o1.id === o2.id : o1 === o2);
  }

  refresh() {
    this.allFactureMarche()
  }

}