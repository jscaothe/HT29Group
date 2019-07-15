import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../shared/authorization.service";
import { Http, Headers } from "@angular/http";
import { Users } from "../shared/Users.service";
import { UsersAttributes } from "../shared/UsersAttributes.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public now: string = "Demo";
  public strApiGateway: string = "https://5vz9msegch.execute-api.ap-northeast-1.amazonaws.com/dev";
  dataResponse: any;
  public user = <Users>{};

  constructor(private http: Http, private auth: AuthorizationService) {
    //setInterval(() => {
    //  this.now = new Date().getHours() + ':' + new Date().getMinutes().toString() + ':' + new Date().getSeconds()
    //}, 1);
  }

  ngOnInit() {
    var authenticatedUser = this.auth.getAuthenticatedUser();
    if (authenticatedUser == null) {
      return;
    }
    authenticatedUser.getSession((err, session) => {
      if (err) {
        console.log(err);
        return;
      }
      this.auth.getAuthenticatedUser().getSession((err, session) => {
        if (err) {
          console.log(err);
          return;
        }
        const token = session.getIdToken().getJwtToken();
        const accessToken = session.getAccessToken().getJwtToken();
        //console.log(accessToken);
        let myHeaders = new Headers();
        myHeaders.append('Authorization', token);
        let options = {
          headers: myHeaders
        };
        let sendData = {
          "AccessToken": accessToken
        };

        this.getResponsePostData(this.strApiGateway + "/getcurrentuser/", options, sendData)
          .then(data => {
            this.getCurrentInfor(data["body"].toString());
            //console.log(data["body"].toString())
          })
      });
    });
  }

  getCurrentInfor(jsonString: string) {
    
    //let user = <Users>{};
    let userAtrr = <UsersAttributes>{};
    var usersInfor = [];
    var arrUserAttr = [];
    usersInfor = JSON.parse(jsonString);
    arrUserAttr = JSON.parse(jsonString).UserAttributes;

    

    this.user.UserId = usersInfor['Username'];
    userAtrr.Name = arrUserAttr[2].Name;
    userAtrr.Value = arrUserAttr[2].Value;
    this.user.UserAttribute = userAtrr;
    //console.log(this.user);
  }

  getUser() {
    //console.log(this.user);
    
    return this.user;
  }

  getEmail() {
    //console.log(this.getUser().UserAttribute.Value);
    return this.getUser().UserAttribute.Value;
  }

  getCurrentDate() {
    return this.now;
  }

  getResponsePostData(url: string, options: any, sendData: any) {
    //var data = { "Username" :  sendData};
    return new Promise(resolve => {
      this.http.post(url, sendData, options)
        .map(results => results.json())
        .subscribe(data => {
          this.dataResponse = data;
          resolve(this.dataResponse);
        })
    });
  }

}
