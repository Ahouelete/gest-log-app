import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetaDonneeService } from 'src/app/services/metaDonneeService';
import { ReglementFactureMarcheService } from 'src/app/services/reglementFactureMarche';

@Component({
  selector: 'app-modal-reglement-invoice-marche',
  templateUrl: './modal-reglement-invoice-marche.component.html',
  styleUrls: ['./modal-reglement-invoice-marche.component.css']
})
export class ModalReglementInvoiceMarcheComponent implements OnInit {
  listModeReglemnt: any = []
  typeMsg = ""
  msg = ""
  numberFormat = new Intl.NumberFormat()

  reglementForm!: FormGroup
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, btnActionValid: string, invoice: any },
    private _metaData: MetaDonneeService, private fb: FormBuilder, private reglementService: ReglementFactureMarcheService) { }
  ngOnInit(): void {
    this.createForm()
    this.getAllModeReglements()
  }

  getAllModeReglements() {
    this._metaData.allModeReglement().subscribe({
      next: (data: any) => {
        this.listModeReglemnt = data
      },
      error: (error: any) => {

      },
      complete: () => {

      }
    })
  }

  createForm() {
    this.reglementForm = this.fb.group({
      dateReg: [null, [Validators.required]],
      montantReg: [0, [Validators.required, Validators.min(1)]],
      reference: [null, [Validators.required]],
      modeReglement: [null, [Validators.required]],
      autresInfo: [null],

    })
  }

  reglerFacture(formData: any) {
    if (formData) {
      let reglement = formData
      reglement.factureMarche = this.data.invoice

      this.reglementService.reglerFacture(reglement).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            this.reglementForm.reset()
            this.msg = 'Reglement effectué avec succès !'
            this.typeMsg = 'success'
            console.log(this.typeMsg, this.msg)
            this.data.invoice = data.data  
          } else {
            this.typeMsg = 'error'
            this.msg = data.message
            console.log(data.message)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.typeMsg = 'error'
          this.msg = error.message
          console.log(error)
        },
        complete: () => {
          console.log('Execution terminee')
        }
      })
    }
  }
  
  compareFn(o1: any, o2: any) {
    return (o1 && o2 ? o1.id === o2.id : o1 === o2);
  }
}
