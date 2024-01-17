import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'compa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    console.log("HomeComponent - ngOnInit");
  }

}
