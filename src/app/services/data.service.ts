import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { forkJoin } from 'rxjs';
import { GlobalConstants } from 'src/app/constants/globalConstants';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  departmentNo: Number;
  employeeData1: string;
  baseUrl:string;
  apiUrl:string;
  jsonHeader = 'application/json; odata=verbose';
  headers = new Headers({ 'Content-Type': this.jsonHeader, 'Accept': this.jsonHeader });
  employeeData: string[];
  
  
  constructor(private httpService: HttpClient) {
    this.setBaseUrl(null); 
  }
  // getEmployeeData(employeeData1){   
  //  // return this.httpService.get("https://granulesomnichem.sharepoint.com/teams/Applications/Lists/Employees/AllItems.aspx");
  //  var randomEmployeeDataGenerator = Observable.create(function(observer) {
  //   setTimeout(function() {    
      
  //       observer.next(GlobalConstants[employeeData1]);
      
      
  //   }, 50);
  // });
  //  return randomEmployeeDataGenerator;
  // }
  getEmployeeData(listname, query){   
    var url = '';   
    url ='https://granulesomnichem.sharepoint.com/teams/Applications';     
    return this.httpService.get(url + "/_api/web/lists/getbytitle('" + listname + "')/items"+ query);
   }

   getGoalYears(listname){   
    var query =  "?select=Title,Year";
   
    var url = '';   
    url ='https://granulesomnichem.sharepoint.com/teams/Applications';     
    return this.httpService.get(url + "/_api/web/lists/getbytitle('" + listname + "')/items"+ query);
   }

    	///////////////////////////////////////////// AddAngularJSListItem
      setEmployeeData = function(allFields:any,listname:string) {          
        this.apiUrl ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'{0}\')/items';
        var hdr = new HttpHeaders();
        hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
        let e1:HTMLInputElement ;
        e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
        hdr = hdr.append('X-RequestDigest', e1.value);
       // var options = new RequestOptions({ headers: this.header });
        const URLs = this.apiUrl.replace('{0}', listname);
        // append metadata
        if (!allFields.__metadata) {
          allFields.__metadata = {
            'type': 'SP.ListItem'
          };
        }
        const data = JSON.stringify(allFields);
        return this.httpService.post(URLs,data,{headers:hdr});
           
         }
    // ----------SHAREPOINT GENERAL----------
    	///////////////////////////////////////////// AddAngularJSListItem
      removeEmployeeData = function(listname: string, id: string) {          
        this.apiUrl ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'{0}\')/items';
        var hdr = new HttpHeaders();
        hdr = hdr.set('X-HTTP-Method', 'DELETE').set('If-Match', '*');
        let e1:HTMLInputElement ;
        e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
        hdr = hdr.append('X-RequestDigest', e1.value);
       // var options = new RequestOptions({ headers: this.header });
        const URLs = this.apiUrl.replace('{0}', listname)+ '(' + id + ')';       
        return this.httpService.post(URLs,'',{headers:hdr});
           
         }

      readItem(listName: string, id: string) {
        this.apiUrl ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'{0}\')/items';
         let url = this.apiUrl.replace('{0}', listName) + '(' + id + ')';
         var hdr = new HttpHeaders();
         hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
         let e1:HTMLInputElement ;
         e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
         hdr = hdr.append('X-RequestDigest', e1.value);
         return this.httpService.get(url,{headers:hdr});
      }

          // ----------SHAREPOINT GENERAL----------
    	///////////////////////////////////////////// AddAngularJSListItem
      editEmployeeData = function(listname: string, id: string, jsonBody: any,etag) {          
        this.apiUrl ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'{0}\')/items';
        var hdr = new HttpHeaders();
        hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('X-HTTP-Method', 'MERGE').set('If-Match',etag).set('Accept','application/json; odata=verbose');
        let e1:HTMLInputElement ;
        e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
        hdr = hdr.append('X-RequestDigest', e1.value);
        if (!jsonBody.__metadata) {
          jsonBody.__metadata = {
            'type': 'SP.ListItem'
          };
        }
        const data = JSON.stringify(jsonBody);
       // var options = new RequestOptions({ headers: this.header });
        const URLs = this.apiUrl.replace('{0}', listname)+ '(' + id + ')';       
        return this.httpService.post(URLs,jsonBody,{headers:hdr});           
         }
    // ----------SHAREPOINT GENERAL----------

  // Set base working URL path
  setBaseUrl(webUrl?: string) {
    if (webUrl) {
      // user provided target Web URL
      this.baseUrl = webUrl;
    } else {
      // default local SharePoint context
      const ctx = window['_spPageContextInfo'];
      if (ctx) {
        this.baseUrl = ctx.webAbsoluteUrl;
      }
    }

    // Default to local web URL
    this.apiUrl = this.baseUrl + '/_api/web/lists/GetByTitle(\'{0}\')/items';

    // Request digest
    const el = document.querySelector('#__REQUESTDIGEST');
    if (el) {
      // Digest local to ASPX page
      // this.headers.delete('X-RequestDigest');
      this.headers.append('X-RequestDigest', el.nodeValue);
    }
  }
  getUserByGroup(groupName) {
    const url = "https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/sitegroups/getbyname(\'{0}\')/users";
    const URLs = url.replace('{0}', groupName);
    var hdr = new HttpHeaders();
    hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
    let e1:HTMLInputElement ;
    e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
    hdr = hdr.append('X-RequestDigest', e1.value);
    return this.httpService.get(URLs,{headers:hdr});
  }

  getMyProfile() {
    const url = 'https://granulesomnichem.sharepoint.com/teams/Applications/_api/SP.UserProfiles.PeopleManager/GetMyProperties?select=*';
    var hdr = new HttpHeaders();
    hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
    let e1:HTMLInputElement ;
    e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
    hdr = hdr.append('X-RequestDigest', e1.value);
    return this.httpService.get(url,{headers:hdr});
  }

  uploadAttach(listName: string, id: string, fileName: string, binary: any, overwrite?: boolean) {
    let url ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'' + listName + '\')/items(' + id;
    var hdr = new HttpHeaders();
        hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
        let e1:HTMLInputElement ;
        e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
        hdr = hdr.append('X-RequestDigest', e1.value);
    if (overwrite) {
      // Append HTTP header PUT for UPDATE scenario
      hdr.append('X-HTTP-Method', 'PUT');
      url += ')/AttachmentFiles(\'' + fileName + '\')/$value';
    } else {
      // CREATE scenario
      url += ')/AttachmentFiles/add(FileName=\'' + fileName + '\')';
    }
    return this.httpService.post(url, binary,{headers:hdr});
  }
  uploadAttachmentByFileNames(listName,id,addFileNameArray,overwrite) {
    let observableBatch = [];
    addFileNameArray.forEach((addFileName) => {
      const formData = new FormData();
      formData.append('file', addFileName.data);
      addFileName.inProgress = true;
      let url ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'' + listName + '\')/items(' + id;
      var hdr = new HttpHeaders();
          hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
          let e1:HTMLInputElement ;
          e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
          hdr = hdr.append('X-RequestDigest', e1.value);
      if (overwrite) {
        // Append HTTP header PUT for UPDATE scenario
        hdr.append('X-HTTP-Method', 'PUT');
        url += ')/AttachmentFiles(\'' + addFileName.data.name + '\')/$value';
      } else {
        // CREATE scenario
        url += ')/AttachmentFiles/add(FileName=\'' + addFileName.data.name + '\')';
      }

      observableBatch.push(this.httpService.post(url, addFileName.data,{headers:hdr}));
    });
    return forkJoin(observableBatch);
  }

  DeleteListItemAttachment(listName: string, id: string, fileName: string) {
    let url ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'' + listName + '\')/items(' + id;
    var hdr = new HttpHeaders();
        hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
        let e1:HTMLInputElement ;
        e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
        hdr = hdr.append('X-RequestDigest', e1.value);
        hdr.append('X-HTTP-Method', 'DELETE');
  
      // CREATE scenario
      url += ')/AttachmentFiles(\'' + fileName + '\')';
  
    return this.httpService.delete(url,{headers:hdr});
  }
  deleteattachmentByFileName(listName,id,deleteFileNameArray) {
    let observableBatch = [];
    deleteFileNameArray.forEach((deleteFileName) => {
      let url ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'' + listName + '\')/items(' + id;
      var hdr = new HttpHeaders();
          hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
          let e1:HTMLInputElement ;
          e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
          hdr = hdr.append('X-RequestDigest', e1.value);
          hdr.append('X-HTTP-Method', 'DELETE');
        // CREATE scenario
        url += ')/AttachmentFiles(\'' + deleteFileName + '\')';

      observableBatch.push(this.httpService.delete(url,{headers:hdr}));
    });
    return forkJoin(observableBatch);
  }
    // Get attachment for item
    getAttach(listName: string, id: string) {
      let url ='https://granulesomnichem.sharepoint.com/teams/Applications/_api/web/lists/GetByTitle(\'' + listName + '\')/items(' + id + ')/AttachmentFiles';
      var hdr = new HttpHeaders();
          hdr = hdr.set('Content-Type', 'application/json; odata=verbose').set('Accept','application/json; odata=verbose');
          let e1:HTMLInputElement ;
          e1 = window.parent.document.querySelector('#__REQUESTDIGEST');      
          hdr = hdr.append('X-RequestDigest', e1.value);
          return this.httpService.get(url,{headers:hdr});
    }


}
