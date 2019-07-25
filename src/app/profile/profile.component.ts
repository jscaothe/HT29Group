import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthorizationService } from "../shared/authorization.service";
import { Http, Headers } from "@angular/http";
import { Users } from "../shared/Users.service";
import { UsersAttributes } from "../shared/UsersAttributes.service";
import { ImageService } from "../shared/image.service";
import { ApiService } from "../shared/api.service";
import { DomSanitizer } from '@angular/platform-browser';


class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-home',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ImageService, ApiService, Users, UsersAttributes]
})


export class ProfileComponent implements OnInit {
  dataResponse: any;
  user = <Users>{};
  base64textString: string;
  selectedFile: File;

  constructor(private http: Http, private auth: AuthorizationService,
    private image: ImageService, private api: ApiService,
    private _sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.user = this.api.getUser();
    //Insert new user when login
    this.insertUserToDB();
  }

  insertUserToDB() {

    this.api.updateUserInfor(this.user);
  }


  registUserToDynamo() {
    let accessToken = this.auth.getAccessToken();
    let token = this.auth.getJwtToken();

    console.log("AccessToken:" + accessToken);
    console.log("Token:" + token);
    
    

    let url = this.auth.getApiGateWay() + "/registtodynamo";
    let myHeaders = new Headers();
    myHeaders.append('Authorization', token);
    let options = {
      headers: myHeaders
    };
    let sendData = {
      "AccessToken": accessToken,
      //"Userid": this.userName,
      "Firstname": "",
      "Lastname": "",
      "Company": "",
      "UrlImage": "",
      "ImageBinary": ""
    };
    this.api.getResponsePostData(url, options, sendData).then(
      data => {
        console.log(data);
      });
  }




  onSubmit(form: NgForm) {
    //when user has upload image

    var user = <Users>{};
    user.UserId = form.value.userid;
    user.Firstname = form.value.firstname;
    user.Lastname = form.value.lastname;
    user.Company = form.value.company;
    user.ImageUrl = form.value.userid + ".jpg";
    user.ImageData = this.base64textString ? this.base64textString : "-";

    this.api.updateUserInfor(user);


  }

  /*uploadImage() {
    let token = this.auth.getJwtToken();
    let url = this.auth.getApiGateWay() + "/uploadprofile";
    let myHeaders = new Headers();
    myHeaders.append('Authorization', token);
    let options = {
      headers: myHeaders
    };
    let sendData = {
      "content": this.base64textString,
      "path": this.user.UserId + ".jpg"
    };
    this.api.getResponsePostData(url, options, sendData).then(
      data => {
        console.log(data);
      });
  }*/

  profileImageChange(event) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.selectedFile);
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log(this.base64textString);
  }
}
