import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-material-carry-details',
  templateUrl: './material-carry-details.component.html',
  styleUrls: ['./material-carry-details.component.scss']
})
export class MaterialCarryDetailsComponent implements OnInit {
  userID: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.userID = params.userID;
      if(!this.userID){
        this.router.navigate(['materials-carry']);
      }
    });
  }

  ngOnInit() {
  }

}
