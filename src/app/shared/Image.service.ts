import { Http, Headers } from "@angular/http";
import { Injectable } from '@angular/core';
import {AuthenticationDetails, CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs/Observable';

export class ImageService {

    constructor(private http: Http) { }
    dataResponse: any;

    public uploadImage(image: File){


        let options = { 
        };
        let sendData = {
            "imageFile" : image
        };

        return this.getResponsePostData("",options,sendData );
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


}