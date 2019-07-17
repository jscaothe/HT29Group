import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

@Injectable()
export class ImageService {
  constructor(private http: Http) { }
  dataResponse: any;

  //constructor() { }

  public uploadImage(image: File) {


    let options = {

    };
    let sendData = {
      "imageFile": image
    };

    return this.getResponsePostData("", options, sendData);
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
