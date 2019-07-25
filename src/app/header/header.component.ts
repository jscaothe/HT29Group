import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../shared/authorization.service";
import { Router } from '@angular/router';
import { ApiService } from "../shared/api.service";
import { Users } from "../shared/Users.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ApiService]
})
export class HeaderComponent {

  user = <Users>{};
  isAdminGroup = false;


  constructor(private auth: AuthorizationService,
    private _router: Router,
    private api: ApiService) { }

  ngOnInit() {
    console.log("DEMO" + this.api.getUser().UserId);
    
    if( this.api.getUser() ) {
        if(this.api.getUser().GroupName == "Admin_Group") {
          this.isAdminGroup = true;
        }
    }
    
  }


  doLogout() {
    this.auth.logOut();
    this.user = null;
    this._router.navigateByUrl('/login');
  }


  getUserInforByApi() {
    let token = this.auth.getJwtToken();
    let accessToken = this.auth.getAccessToken();

    if (typeof token !== 'undefined') {

      let url = this.auth.getApiGateWay() + "/getuser";

      let myHeaders = new Headers();
      myHeaders.append('Authorization', token);
      let options = {
        headers: myHeaders
      };
      let sendData = {
        "AccessToken": accessToken
      };
      this.api.getResponsePostData(url, options, sendData).then(
        data => {
          this.getCurrentInfor(data);
        });
    }
  }


  getCurrentInfor(data: any) {
    var usersInfor = data["UserInfor"]
    //this.user.UserId = usersInfor['UserId'];
    //this.user.Firstname = usersInfor['Firstname'];
    //this.user.Lastname = usersInfor['Lastname'];
    //this.user.Company = usersInfor['Company'];
    //this.user.Email = usersInfor['Email'];
    this.user.GroupName = usersInfor['GroupName'];
    //console.log("Ten group:" + this.user.GroupName);

  }

  checkAdminGroup(event) {
    if (this.user != null) {
      if (this.user.GroupName == 'Admin_Group') {
        event.preventDefault();
        return true;
      }
    }
    return false;
  }
}
