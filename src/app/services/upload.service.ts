import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor() { }
  upload(listName: string, id: string, fileName: string, binary: any, overwrite?: boolean){
    // let url = this.baseUrl + '/_api/web/lists/GetByTitle(\'' + listName + '\')/items(' + id;
    // const options = this.options;
    // if (overwrite) {
    //   // Append HTTP header PUT for UPDATE scenario
    //   options.headers.append('X-HTTP-Method', 'PUT');
    //   url += ')/AttachmentFiles(\'' + fileName + '\')/$value';
    // } else {
    //   // CREATE scenario
    //   url += ')/AttachmentFiles/add(FileName=\'' + fileName + '\')';
    // }
    // return this.http.post(url, binary, options).toPromise().then(function (res: Response) {
    //   return res.json();
    // }).catch(this.handleError);
  }


  
}
