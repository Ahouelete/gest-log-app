import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/authService';
import { DaoService } from 'src/app/services/daoService';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MetaDonneeService } from '../../services/metaDonneeService';
import { TiersService } from 'src/app/services/tiersServices';
import { HttpErrorResponse } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-dao',
  templateUrl: './dao.component.html',
  styleUrls: ['./dao.component.css']
})
export class DaoComponent implements OnInit {
  typeTiers = {
    id: 2,
    intitule: 'CLIENT'
  }

  element_deleted: any
  displayedColumns: string[] = ['#', 'code', 'designation', 'dateAnnonce', 'montantOffre', 'statutDao', 'actions'];
  dataSource!: MatTableDataSource<any>;
  daoForm: FormGroup | any
  statutDaoForm: FormGroup | any
  pieceJointeForm: FormGroup | any
  action = "ON_CREATE"
  msg = ''
  fileName = ""
  fileSize = ""
  typeMsg = ''
  listStatutDAO: any
  listClient: any = []
  selectedValue!: string
  numberFormat = new Intl.NumberFormat()
  dateFormat = new Intl.DateTimeFormat('en-US')
  pieceDaoForm: FormGroup | any
  listPieceAFournir: any[] = []
  listPieceDisponible: any[] = []
  listPieceJointe: any[] = []
  listPieceAJoindre: any[] = []
  listPiece: any[] = []
  piecesAFournirEtJointes: any[] = []

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild('stepper') stepper!: MatStepper
  ngOnInit() {
    this.createPieceJointeDaoForm()
    this.createPieceDaoForm()
    this.createStatutDaoForm()
    this.createForm()
    this.getAllStatutDao()
    this.getAllClient()
    this.all()
    this.getAllPieceAFournir()
  }

  constructor(private _fbuilder: FormBuilder, private _authService: AuthService,
    private _daoService: DaoService, private metaData: MetaDonneeService,
    public dialog: MatDialog, private tiersService: TiersService,
  ) {

  }

  onSave(formData: any) {
    const formStatutDao = this.statutDaoForm.value
    let formDao = formData
    formDao.statutDao = formStatutDao.statutDao
    formDao.dateDepot = formStatutDao.dateDepot
    this.reconstituerPieceDao()
    switch (this.action) {
      case "ON_CREATE": // AJOUT DE CATEGORIE
        this.create(formDao)
        break;
      case "ON_UPDATE": // MISE A JOUR DE CATEGORIE
        this.update(formDao)
        break;
    }
  }

  buildJauge() {
    const total = this.listPieceAFournir.length
    const countWithPiece = this.listPieceJointe.length
    let tauxWithPiece: number = 0
    let tauxWithoutPiece: number = 0
    if (total == 0) {
      tauxWithPiece = 0,
        tauxWithoutPiece = 0
    } else {
      tauxWithPiece = Math.round((countWithPiece / total) * 100)
      tauxWithoutPiece = 100 - tauxWithPiece
    }

    const containWithoutPiece = document.getElementById('contain-without-piece') as HTMLElement
    while (containWithoutPiece.firstChild) {
      containWithoutPiece.removeChild(containWithoutPiece.firstChild);
    }
    if (tauxWithoutPiece !== 0) {
      containWithoutPiece.style.width = tauxWithoutPiece + "%"
      containWithoutPiece.style.color = "rgb(194 50 147 / 83%)"
      containWithoutPiece.style.fontWeight = "500"
      const spanWithout1 = document.createElement('span')
      spanWithout1.innerText = 'Pièces non fournies'
      spanWithout1.classList.add('font-size-11')
      containWithoutPiece.appendChild(spanWithout1)
      const spanWithout2 = document.createElement('span')
      spanWithout2.innerText = tauxWithoutPiece + "%"
      containWithoutPiece.appendChild(spanWithout2)
      const divWithout = document.createElement('div')
      divWithout.classList.add('flex-grow-10')
      divWithout.style.height = "15px"
      divWithout.style.backgroundColor = "rgb(194 50 147 / 83%)"
      divWithout.style.display = tauxWithoutPiece == 0 ? "none" : "block"
      containWithoutPiece.appendChild(divWithout)
    }

    const containWithPiece = document.getElementById('contain-with-piece') as HTMLElement
    while (containWithPiece.firstChild) {
      containWithPiece.removeChild(containWithPiece.firstChild);
    }
    if (tauxWithPiece !== 0) {
      containWithPiece.style.width = tauxWithPiece + "%"
      containWithPiece.style.color = "#5b5ba0"
      containWithPiece.style.fontWeight = "500"
      const spanWith1 = document.createElement('span')
      spanWith1.innerText = 'Pièces fournies'
      spanWith1.classList.add('font-size-11')
      containWithPiece.appendChild(spanWith1)
      const spanWith2 = document.createElement('span')
      spanWith2.innerText = tauxWithPiece + "%"
      containWithPiece.appendChild(spanWith2)
      const divWith = document.createElement('div')
      divWith.classList.add('flex-grow-10')
      divWith.style.height = "15px"
      divWith.style.backgroundColor = "#5b5ba0"
      divWith.style.display = tauxWithPiece == 0 ? "none" : "block"
      containWithPiece.appendChild(divWith)
    }
  }

  reconstituerPieceDao() {
    this.piecesAFournirEtJointes = []
    this.listPieceAFournir.forEach(afournir => {
      let isFound = false
      let pieceJointe = null
      let formData = {}
      this.listPieceJointe.forEach(jointe => {
        if (jointe.piece.id == afournir.pieceAFournir.id) {
          isFound = true
          pieceJointe = jointe.pieceJointe
        }
      })

      if (isFound) {
        formData = {
          id: null,
          pieceDao: afournir.pieceAFournir,
          pieceJointe: pieceJointe,
          estObligatoire: afournir.estObligatoire ? true : false,
          nbCopie: afournir.quantite,
          dao: null,
          estFournie: true,
          autresInfos: afournir.autresInfos
        }
      }
      else {
        formData = {
          id: null,
          pieceDao: afournir.pieceAFournir,
          pieceJointe: pieceJointe,
          estObligatoire: afournir.estObligatoire ? true : false,
          nbCopie: afournir.quantite,
          dao: null,
          estFournie: false,
          autresInfos: afournir.autresInfos
        }
      }
      this.piecesAFournirEtJointes = [...this.piecesAFournirEtJointes, formData]
    })
  }

  createPieceDaoForm() {
    this.pieceDaoForm = this._fbuilder.group({
      id: [null,],
      pieceAFournir: [null, Validators.required],
      estObligatoire: [false],
      quantite: [1, [Validators.min(1), Validators.required]],
      autresInfos: [null, [Validators.maxLength(100)]]
    })
  }
  createStatutDaoForm() {
    this.statutDaoForm = this._fbuilder.group({
      statutDao: [null, Validators.required],
      dateDepot: [null, Validators.required]
    })
  }

  createPieceJointeDaoForm() {
    this.pieceJointeForm = this._fbuilder.group({
      piece: [null, Validators.required],
      pieceJointe: [null],
      nbCopie: [{ value: 1, disabled: true }, [Validators.required, Validators.min(1)]],
      estObligatoire: [{ value: false, disabled: true }],
      estFournie: [false],
      autresInfos: [{ value: 1, disabled: true }, [Validators.maxLength(100)]]
    })
  }

  onDisplayModal() {
    const containerOverflow = document.querySelector('.modal-generate-overlay') as HTMLElement
    const containerModal = document.querySelector('.modal-generate-content') as HTMLElement
    containerOverflow.classList.toggle('active')
    containerModal.classList.toggle('active')
  }

  onDisplayModalPieceJointe() {
    const containerOverflow = document.querySelector('.modal-piece-jointe-overlay') as HTMLElement
    const containerModal = document.querySelector('.modal-piece-jointe-content') as HTMLElement
    containerOverflow.classList.toggle('active')
    containerModal.classList.toggle('active')
  }

  deleteItem(index: number) {
    this.listPieceAFournir.splice(index, 1)
  }

  deleteItemPieceJointe(index: number) {
    this.listPieceJointe.splice(index, 1)
  }
  getAllPieceAFournir() {
    this._daoService.allPieceAFournir().subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.listPiece = data.data
        } else {
          this.listPiece = []
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      },
      complete: () => {
        console.log('Execution complete')
      }
    })
  }

  onpenFormPieceDao() {
    this.listPieceDisponible = this.listPiece.filter(piece =>
      (this.listPieceAFournir.filter(pieceAFournir => pieceAFournir.pieceAFournir.code == piece.code) as Array<any>).length == 0 ? true : false
    )
    this.pieceDaoForm.reset()
    this.onDisplayModal()
  }

  onpenFormPieceDaoPieceJointe() {
    this.listPieceAJoindre = this.listPieceAFournir.filter(pieceAFournir =>
      (this.listPieceJointe.filter(pieceFourni => pieceAFournir.pieceAFournir.code == pieceFourni.piece.code) as Array<any>).length == 0 ? true : false
    )
    this.fileName = ""
    this.fileSize = ""
    this.pieceJointeForm.reset()
    this.onDisplayModalPieceJointe()
  }

  openFolder() {
    const inputFile = document.getElementById('input-piece-file') as HTMLElement
    inputFile.click()
  }

  formatSizeUnits(bytes: any) {
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1) { bytes = bytes + " bytes"; }
    else if (bytes == 1) { bytes = bytes + " byte"; }
    else { bytes = "0 bytes"; }
    return bytes;
  }

  fileChoose(file: any): void {
    const filePiece: File = file.target.files[0]
    this.fileName = filePiece.name
    this.fileSize = this.formatSizeUnits(filePiece.size)
    if (filePiece.size > 51200) {
      this.fileName = ''
      this.fileSize = ''
      alert('La taille du fichier ne doit dépasser 50KB')
    }

    if (filePiece && this.fileSize) {
      if (/(jpe?g|png)$/i.test(filePiece.type)) {
        const r = new FileReader()
        r.addEventListener('load', () => {
          const base64Img = r.result
          this.pieceJointeForm.controls.pieceJointe.setValue(base64Img)
        }, false)
        r.readAsDataURL(filePiece)
      }
    }
  }

  downloadPiece(pieceJointe: string) {
    const type = pieceJointe.split(';')[0].split(':')[1].split('/')[1]
    const base64Img = pieceJointe
    const binaryImg = this.convertDataURIToBinary(base64Img)
    const blob = new Blob([binaryImg], { type: type });
    const blobURL = window.URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.download = 'piece-jointe.' + type
    a.href = blobURL
    a.click()
  }
  convertDataURIToBinary(dataURI: any) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  addPieceDao() {
    this.listPieceAFournir = [...this.listPieceAFournir, this.pieceDaoForm.value]
    this.onDisplayModal()
  }

  addPieceDaoJointe() {
    let formData = this.pieceJointeForm.value
    formData.estFournie = true;
    this.listPieceJointe = [...this.listPieceJointe, formData]
    //console.log(formData)
    this.onDisplayModalPieceJointe()
  }


  getAllClient() {
    this.tiersService.getallTiersByType(this.typeTiers.id).subscribe({
      next: (data: any) => {
        if (data.description == 'success') {
          this.listClient = data.data
        } else {
          this.listClient = []
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      },
      complete: () => {
        console.log('Execution complete')
      }
    })
  }
  update(formData: any) {
    delete formData.pieceJointeDao
    const daoDataForm = {
      dao: formData,
      pieceDao: this.piecesAFournirEtJointes
    }
    if (formData) {
      this._daoService.update(daoDataForm).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "Le DAO " + formData.code + " " + formData.designation + " a été modifié avec succès!"
            this.resetdaoForm()
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
      this.all()
    }
  }

  create(formData: any) {
    if (formData) {
      delete formData.pieceJointeDao
      const daoDataForm = {
        dao: formData,
        pieceDao: this.piecesAFournirEtJointes
      }
      this._daoService.create(daoDataForm).subscribe({
        next: (data: any) => {
          if (data.description == "success") {
            // executer avec success
            this.typeMsg = 'success'
            this.msg = "Le DAO " + formData.code + " " + formData.designation + " a été enregistré avec succès!"
            this.all()
            this.resetdaoForm()
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
    const listofpieceDao = formData.pieceJointeDao
    const statutDaoFormData = {
      statutDao: formData.statutDao,
      dateDepot: formData.dateDepot
    }

    const f = {
      id: formData.id,
      code: formData.code,
      designation: formData.designation,
      soumissionnaire: formData.soumissionnaire,
      montantOffre: formData.montantOffre,
      montantAccepte: formData.montantAccepte,
      dateAnnonce: formData.dateAnnonce,
      motif: formData.motif,
      tiers: formData.tiers,
      pieceJointeDao: formData.pieceJointeDao
    }
    this.daoForm.setValue(f)
    this.statutDaoForm.setValue(statutDaoFormData)
    // console.log(this.statutDaoForm.controls['statutDao'].value)
    this.listPieceAFournir = []
    this.listPieceAJoindre = []
    this.listPieceDisponible = []
    this.listPieceJointe = []

    if (listofpieceDao) {
      listofpieceDao.forEach((element: any) => {
        this.listPieceAFournir = [...this.listPieceAFournir, {
          id: element.id,
          quantite: element.nbCopie,
          estObligatoire: element.estObligatoire,
          pieceAFournir: element.pieceDao
        }]
        if (element.estFournie) {
          this.listPieceJointe = [...this.listPieceJointe, {
            id: element.id,
            estObligatoire: element.estObligatoire,
            piece: element.pieceDao,
            pieceJointe: element.pieceJointe,
            nbCopie: element.nbCopie
          }]
        }
      });
    }
    this.action = "ON_UPDATE"
    this.buildJauge()
  }

  deleteCategorie(formData: any) {
    if (formData) {
      this._daoService.delete(formData.id).subscribe({
        next: (data: any) => {
          if (data.description == 'success') {
            // Supprimer avec succes
            this.typeMsg = 'success'
            this.msg = "Le DAO " + formData.code + " " + formData.designation + " a été supprimé avec succès!"
            this.element_deleted = null
            this.all()
            this.resetdaoForm()
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
  resetdaoForm() {
    this.action = "ON_CREATE"
    this.daoForm.reset()
    this.pieceDaoForm.reset()
    this.pieceJointeForm.reset()

    this.listPieceAFournir = []
    this.listPieceJointe = []
    this.listPieceAJoindre = []
    this.listPieceDisponible = []
    this.stepper.reset()
  }
  createForm() {
    this.daoForm = this._fbuilder.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
      designation: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      soumissionnaire: [null, [Validators.required, Validators.maxLength(100)]],
      montantOffre: [0, [Validators.required, Validators.pattern('[0-9]*')]],
      montantAccepte: [0, [Validators.required, Validators.pattern('[0-9]*')]],
      dateAnnonce: [null, Validators.required],
      motif: [null],
      tiers: [null, [Validators.required]],
      pieceJointeDao: [null]
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
    this._daoService.all().subscribe({
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
          message: 'Etes-vous sur de vouloir supprimer ce DAO ?',
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

  getAllStatutDao() {
    this.metaData.allStatutDao().subscribe({
      next: (data: any) => {
        this.listStatutDAO = data
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