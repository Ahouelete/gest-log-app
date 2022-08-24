import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/globalService';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {


  constructor(private _globalService: GlobalService) { }

  //declarations
  isConnected = false
  first_group_items = true
  second_group_items = true
  third_group_items = true
  four_group_items = true
  firstCharact = ''

  ngOnInit(): void {
    this.getCurrentUser()
  }


  getCurrentUser() {
    const user = this._globalService.getCurrentUser()
    if (user) {
      const {userName} = user
      this.isConnected = true
      this.firstCharact = userName.charAt(0).toUpperCase()
    }
  }

}
