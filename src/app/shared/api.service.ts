import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { AuthorizationService } from "../shared/authorization.service";
import { Users } from "../shared/Users.service";
import { DomSanitizer } from '@angular/platform-browser';



@Injectable()
export class ApiService {


	jwtToken: any;
	dataResponse: any;
	user = <Users>{};
	imagePath: any;
	base64textString: string;


	constructor(private http: Http,
		private auth: AuthorizationService,
		private _sanitizer: DomSanitizer) { }

	getJwtToken() {
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
				this.jwtToken = session.getIdToken().getJwtToken();
			});
		});
		return this.jwtToken;
	}

	getResponseGetData(url: string, options: any) {
		var dataResponse: any;
		return new Promise(resolve => {
			this.http.get(url, options)
				.map(results => results.json())
				.subscribe(data => {
					this.dataResponse = data;
					resolve(this.dataResponse);
				})
		});
	}

	getResponsePostData(url: string, options: any, sendData: any) {
		return new Promise(resolve => {
			this.http.post(url, sendData, options)
				.map(results => results.json())
				.subscribe(data => {
					this.dataResponse = data;
					resolve(this.dataResponse);
				})
		});
	}

	getUserInforByApi() {
		let token = this.auth.getJwtToken();
		let accessToken = this.auth.getAccessToken();
		console.log("TOKEN: " + token);
		console.log("ACCESS TOKEN: " + accessToken);
		
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
			this.getResponsePostData(url, options, sendData).then(
				data => {
					console.log();
					this.getCurrentInfor(data);
					this.getProfileImage();
				});
		}
	}


	updateUserInfor(user: Users) {

		console.log("User Id : " + user.UserId);
		console.log("Firstname: "+ user.Firstname);
		console.log("Lastname: "+ user.Lastname);
		console.log("Company: "+ user.Company);
		console.log("UrlImage : " + user.ImageUrl);
		console.log("ImageBinary: "+ user.ImageData);

		let token = this.auth.getJwtToken();
		let accessToken = this.auth.getAccessToken();
		if (typeof token !== 'undefined') {
			let url = this.auth.getApiGateWay() + "/updateuser";
			let myHeaders = new Headers();
			myHeaders.append('Authorization', token);
			let options = {
				headers: myHeaders
			};
			let sendData = {
				"AccessToken": accessToken,
				"UserId": user.UserId,
				"Firstname": user.Firstname,
				"Lastname": user.Lastname,
				"Company": user.Company,
				"UrlImage": user.ImageUrl,
				"ImageBinary": user.ImageData
			};
			this.getResponsePostData(url, options, sendData).then(
				data => {
					this.user = this.getUser();
					console.log("Updated!!!:"+data);
				});
		}
	}

	getCurrentInfor(data: any) {
		var usersInfor = data["UserInfor"]
		this.user.UserId = usersInfor['UserId'];
		this.user.Firstname = usersInfor['Firstname'];
		this.user.Lastname = usersInfor['Lastname'];
		this.user.Company = usersInfor['Company'];
		this.user.Email = usersInfor['Email'];
		this.user.GroupName = usersInfor['GroupName'];
		this.user.ImageData = usersInfor['EncodeImage'];
	}

	getUser() {
		this.getUserInforByApi();
		return this.user;
	}

	getProfileImage() {
		this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.user.ImageData);
	}

	getImageProfile() {
		return this.imagePath;
	}

}
