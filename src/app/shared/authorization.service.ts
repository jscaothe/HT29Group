import { Injectable } from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs/Observable';

const poolData = {
  UserPoolId: 'ap-northeast-1_dZicTbBUW', // Your user pool id here
  ClientId: '39h3stmdpvlg9vv4u6guf0lsfm' // Your client id here  
};


const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthorizationService {

  public apiGateway : string =  "https://5vz9msegch.execute-api.ap-northeast-1.amazonaws.com/dev";
  public cognitoDomain : string = "https://demologin.auth.ap-northeast-1.amazoncognito.com";
  public s3Url : string = "http://localhost:4200";

  cognitoUser: any;
  jwtToken : any;
  accessToken: any;

  constructor() { }

  getApiGateWay() {
    return this.apiGateway;
  }


  loginLink() {
    let loginLink : string;
    loginLink = this.cognitoDomain + "/login?response_type=code&client_id="+ poolData.ClientId +"&redirect_uri=" + this.s3Url;
    return loginLink;
  }

  register(email, password) {

    const attributeList = [];

    return Observable.create(observer => {
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.log("signUp error", err);
          observer.error(err);
        }

        this.cognitoUser = result.user;
        console.log("signUp success", result);
        observer.next(result);
        observer.complete();
      });
    });

  }

  confirmAuthCode(code) {
    const user = {
      Username : this.cognitoUser.username,
      Pool : userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
          console.log(err);
          observer.error(err);
        }
        console.log("confirmAuthCode() success", result);
        observer.next(result);
        observer.complete();
      });
    });
  }

  signIn(email, password) { 

    const authenticationData = {
      Username : email,
      Password : password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username : email,
      Pool : userPool
    };
    const cognitoUser = new CognitoUser(userData);
    
    return Observable.create(observer => {

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          
          //console.log(result);
          observer.next(result);
          observer.complete();
        },
        onFailure: function(err) {
          console.log(err);
          observer.error(err);
        },
      });
    });
  }

  isLoggedIn() {    
    return userPool.getCurrentUser() != null;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return userPool.getCurrentUser();
  }

  logOut() {
    this.getAuthenticatedUser().signOut();
    this.cognitoUser = null;
  }


  getJwtToken() {
    var authenticatedUser = this.getAuthenticatedUser();
		if (authenticatedUser == null) {
			return;
		}
		authenticatedUser.getSession((err, session) => {
			if (err) {
				console.log(err);
				return;
			}
  
			this.getAuthenticatedUser().getSession((err, session) => {
				if (err) {
					console.log(err);
					return;
				}
        this.jwtToken = session.getIdToken().getJwtToken();
        //alert(this.jwtToken);
			});
    });
    return this.jwtToken;
  }

  getAccessToken() {
    var authenticatedUser = this.getAuthenticatedUser();
		if (authenticatedUser == null) {
			return;
		}
		authenticatedUser.getSession((err, session) => {
			if (err) {
				console.log(err);
				return;
			}
  
			this.getAuthenticatedUser().getSession((err, session) => {
				if (err) {
					console.log(err);
					return;
				}
				this.accessToken = session.getAccessToken().getJwtToken();
			});
    });
    return this.accessToken;
  }


  
}
