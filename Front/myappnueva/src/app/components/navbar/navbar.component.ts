import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  userLogged = this.user.getUserLogged();
opened=false;
constructor(private user: UserService) {}

  ngOnInit() : void {

  }
  logOut(){
    this.user.logOut();
  }


}

