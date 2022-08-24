import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService';
import { GlobalService } from 'src/app/services/globalService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //declarations 
  isConnected = false
  firstCharact = ''
  user : any
  constructor(private _globalService: GlobalService, private _authService: AuthService) { }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  getCurrentUser() {
     this.user = this._globalService.getCurrentUser()
    if (this.user) {
      const { userName } = this.user
      this.isConnected = true
      this.firstCharact = userName.charAt(0).toUpperCase()
    }
  }

  signOut() {
    this._authService.signOut()
    this.isConnected = true
  }

  openModal(){
    const modalContent = document.querySelector('.modal-content') as HTMLElement
    const modalbox = document.querySelector('.box-modal') as HTMLElement
    modalContent.classList.toggle('active')
    modalbox.classList.toggle('active')
  }
}
