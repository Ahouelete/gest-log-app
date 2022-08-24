import { Component, DoCheck, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnChanges {

  titleAlert = '';
  @Input() typeAlert = ''
  @Input() msgAlert = ''
  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.typeAlert == 'error' ? this.titleAlert = "Erreur" : this.titleAlert = 'Succès';
  }

}
