//dialog-box.component.ts
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { UploadService } from 'src/app/services/upload.service';

export interface UsersData {
  name: string;
  id: number;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit{
   Levels = [
      {value: 'Controller', viewValue: 'Controller'},
      {value: 'Executor', viewValue: 'Executor'},
      {value: 'Strategic', viewValue: 'Strategic'}
    ];
    status = [
      {value: 'In Progress', viewValue: 'In Progress'},
      {value: 'Completed', viewValue: 'Completed'},
      {value: 'Hold', viewValue: 'Hold'}
    ];
    ratings = [
      {value: '2', viewValue: '2'},
      {value: '3', viewValue: '3'},
      {value: '4', viewValue: '4'}
    ];
  action:string;
  isFormFieldInvalid=false;
 // local_data:any={'file':'','Department':'','Relevance':'','Code':'','CoreValues':'','Levels':'','Category':'','KPI':'','Impact':'','Plan':'','Weightage':'','Metric':'','status':''};
  local_data:any;
  @ViewChild("fileInput") fileInput: ElementRef;
  files  = [];  
  file=[];
  deleteFile=[];
  listName = "EmployeesKPI";
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,private uploadService: UploadService,private dataService:DataService) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
   ngOnInit() {
      if(this.local_data.action==='Update'){
         this.file=JSON.parse(JSON.stringify(this.local_data.fileNames));
      }
   }
   deleteAttachment(fileName){    
      if(this.local_data.action==='Update'){        
         //this.local_data.fileNames;
         for(let i=0;i<this.file.length;i++){
            if(this.file[i]==fileName){
               this.deleteFile.push(this.file[i]);
               this.file.splice(i, 1); 
            }
         }
      }
      if(this.local_data.action==='Add'){
         for(let i=0;i<this.files.length;i++){
            if(this.files[i].data.name==fileName){
               this.files.splice(i, 1); 
            }
         }
         this.file=this.getFileNames(this.files);
      }
     
   }
  doAction(form: NgForm){
  // this.local_data=this.files;
   if(this.local_data.Department ===undefined || this.local_data.Department ===null || this.local_data.Department ===""){
    this.isFormFieldInvalid=true;
   }
   if(this.local_data.Relevance ===undefined || this.local_data.Relevance ===null || this.local_data.Relevance ===""){
    this.isFormFieldInvalid=true;
}
// if(this.local_data.Code ===undefined || this.local_data.Code ===null || this.local_data.Code ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.CoreValues ===undefined || this.local_data.CoreValues ===null || this.local_data.CoreValues ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.Levels ===undefined || this.local_data.Levels ===null || this.local_data.Levels ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.Category ===undefined || this.local_data.Category ===null || this.local_data.Category ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.KPI ===undefined || this.local_data.KPI ===null || this.local_data.KPI ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.Impact ===undefined || this.local_data.Impact ===null || this.local_data.Impact ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.Plan ===undefined || this.local_data.Plan ===null || this.local_data.Plan ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.Weightage ===undefined || this.local_data.Weightage ===null || this.local_data.Weightage ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.Metric ===undefined || this.local_data.Metric ===null || this.local_data.Metric ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.status ===undefined || this.local_data.status ===null || this.local_data.status ===""){
//    this.isFormFieldInvalid=true;
// }
// if(this.local_data.file ===undefined || this.local_data.file ===null || this.local_data.file ===""){
//    this.isFormFieldInvalid=true;
// }
  // else{
   if (form.invalid) {
      return;
   }
   this.local_data['fileNames']=  this.file.filter((value, index) => {
      return  this.file.indexOf(value) === index;
    });
    this.dialogRef.close({event:this.action,data:this.local_data,file:this.files,deleteFile:this.deleteFile});
  // }   
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

  onClick() {  
    const fileInput = this.fileInput.nativeElement;
    fileInput .onchange = () => {  
      // if(this.local_data.action==='Update'){

      // }
        for (let index = 0; index < fileInput .files.length; index++)  
        {  
             const file = fileInput .files[index];  
             this.files.push({ data: file, inProgress: false, progress: 0});  
        }  
        if(this.local_data.action==='Add'){
           this.file=this.getFileNames(this.files);
        }
        if(this.local_data.action==='Update'){
         this.file=this.file.concat(this.getFileNames(this.files));
         this.file=  this.file.filter((value, index) => {
            return  this.file.indexOf(value) === index;
        });
      } 

      
    };  
    console.log(this.files);   
    fileInput.click();  
}
getFileNames(file){ 
   var fileName = [];  
   for(let i=0;i<file.length;i++){
      fileName.push(file[i].data.name);
   }
   return fileName;
 }

}
