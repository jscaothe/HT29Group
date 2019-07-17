import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../shared/authorization.service";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { Users } from "../shared/Users.service"
import { UsersAttributes } from "../shared/UsersAttributes.service";

export class PersonWithCars {
	constructor(public name: string, public age: number) { }
}

@Component({
	selector: 'app-restapi',
	templateUrl: './restapi.component.html',
	styleUrls: ['./restapi.component.css']
})
export class RestApiComponent implements OnInit {

	dataResponse: any;
	
	public lstUsers: Users[] = [];


	constructor(private http: Http, private auth: AuthorizationService) { }

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
				let myHeaders = new Headers();
				myHeaders.append('Authorization', token);
				//alert(token);
				let options = { headers: myHeaders };
				console.log(this.auth.getApiGateWay());
				this.getResponseGetData(this.auth.getApiGateWay() + "/listusers", options)
					.then(data => {
						this.listAllUser(data["body"].toString());
					});
			});
		});

	}

	getUserById(UserId : string) {
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
				let myHeaders = new Headers();
				myHeaders.append('Authorization', token);
				let options = { 
					headers: myHeaders 
				};
				let sendData = {
					"Username" : UserId
				};

				this.getResponsePostData(this.auth.getApiGateWay()+ "/getuser/",options,sendData )
				.then(data => {
					console.log(data)
				})
			});
		});
	}

	listAllUser(jsonString: string) {
		var users = [];
		
		users = JSON.parse(jsonString).Users;
		
		for (const key in users) {
			if (users.hasOwnProperty(key)) {
				const element = users[key];
				let user = <Users>{};
				user.UserId = element.Username;
				user.UserStatus = element.UserStatus;
				var lstUsersAttributes: UsersAttributes[] =[];
				for (const key in element.Attributes) {
					if (element.Attributes.hasOwnProperty(key)) {
						const attr = element.Attributes[key];
						//console.log(attr);
						let userAttributes = <UsersAttributes>{};
						userAttributes.Name = attr.Name;
						userAttributes.Value = attr.Value;
						lstUsersAttributes.push(userAttributes);
					}
				}
				user.UsersAttributes = lstUsersAttributes;
				this.lstUsers.push(user);

			}
		}
	}

	getEmailFromAttributes(userAttributes : UsersAttributes[]) {
		return userAttributes[2].Value;
	}

	getResponseGetData(url: string, options: any) {
		return new Promise(resolve => {
			this.http.get(url, options)
				.map(results => results.json())
				.subscribe(data => {
					this.dataResponse = data;
					resolve(this.dataResponse);
				})
		});
	}
	
	getResponsePostData(url: string, options: any, sendData : any) {
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
