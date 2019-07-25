import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../shared/authorization.service";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { Users } from "../shared/Users.service";
import { UsersAttributes } from "../shared/UsersAttributes.service";
import { ApiService } from "../shared/api.service";


export class PersonWithCars {
	constructor(public name: string, public age: number) { }
}

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
	providers: [ApiService]
})
export class AdminComponent implements OnInit {

	lstUsers: Users[] = [];
	GroupName: string = "";


	constructor(private http: Http, private auth: AuthorizationService,
		private api: ApiService) { }

	ngOnInit() {
		this.getListUserByApi();
	}


	getListUserByApi() {

		this.lstUsers = [];

		let token = this.auth.getJwtToken();
		let url = this.auth.getApiGateWay() + "/listusers";
		let myHeaders = new Headers();
		myHeaders.append('Authorization', token);
		let options = { headers: myHeaders };
		if (token) {
			this.api.getResponseGetData(url, options).then(data => {
				//console.log(data);
				
				this.listAllUser(data["body"]);
				
			});
		}
	}

	addToAdmin(userId: string) {
		//alert(data);
		let token = this.auth.getJwtToken();
		let accessToken = this.auth.getAccessToken();
		let url = this.auth.getApiGateWay() + "/adminvote";
		let myHeaders = new Headers();
		myHeaders.append('Authorization', token);
		let options = {
			headers: myHeaders
		};
		let sendData = {
			"UserId": userId
		};
		this.api.getResponsePostData(url, options, sendData).then(
			data => {
				console.log(data);
				this.getListUserByApi();
			});
	}


	getGroupNameByUserId(user: Users) {
		let token = this.auth.getJwtToken();
		let accessToken = this.auth.getAccessToken();
		let url = this.auth.getApiGateWay() + "/getgroupname";
		let myHeaders = new Headers();
		myHeaders.append('Authorization', token);
		let options = {
			headers: myHeaders
		};
		let sendData = {
			"AccessToken": accessToken,
			"UserId": user.UserId
		};
		this.api.getResponsePostData(url, options, sendData).then(
			data => {
				user.GroupName = data["GroupName"];
			});
	}

	listAllUser(jsonString: string) {
		var users = [];

		var temp = JSON.parse(jsonString);
		users = JSON.parse(temp).Users;
		
		for (const key in users) {
			if (users.hasOwnProperty(key)) {
				const element = users[key];
				let user = <Users>{};
				user.UserId = element.Username;
				this.getGroupNameByUserId(user);
				user.UserStatus = element.UserStatus;
				user.Email = element.Attributes[2].Value;
				this.lstUsers.push(user);
			}
		}
	}

}
