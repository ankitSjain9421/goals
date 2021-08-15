//dialog-box.component.ts
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { employee } from 'src/app/model/employee';
import { kpi } from 'src/app/model/kpi';
import { DataService } from 'src/app/services/data.service';
import { UploadService } from 'src/app/services/upload.service';
declare let google: any;
export interface UsersData {
  name: string;
  id: number;
}


@Component({
  selector: 'app-dialog-box-dashboard',
  templateUrl: './dialog-box-dashboard.component.html',
  styleUrls: ['./dialog-box-dashboard.component.css']
})
export class DialogBoxDashboardComponent implements OnInit{
   kpi: kpi[];
   d = new Date();
   selectedCriteria: String;
   formatDate = this.d.getFullYear() + '-' +  (this.d.getMonth() + 1)+ '-' +this.d.getDate() +'T00:00:00.000Z';
   getItemsQueryForPieChart="";
   listName1 = "EmployeesKPI";
   departmentNo: Number;
   dataSource = new MatTableDataSource();
   @ViewChild(MatPaginator) paginator: MatPaginator;
   @ViewChild(MatSort) sort: MatSort;
   employeeData: employee[];
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
    public dialogRef: MatDialogRef<DialogBoxDashboardComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData,private uploadService: UploadService,private dataService:DataService) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }
   ngOnInit() {
    this.getChart(this.local_data.chartData.inprogress,
      this.local_data.chartData.completed,
      this.local_data.chartData.hold,
      this.local_data.chartData.twoRatingMid,
      this.local_data.chartData.fourRatingMid,
      this.local_data.chartData.threeRatingMid,
      this.local_data.chartData.twoRatingAnnual,
      this.local_data.chartData.threeRatingAnnual,
      this.local_data.chartData.fourRatingAnnual);
     
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
 private getEmployees(getItemsQuery,formatDate?) {
   this.dataService.getEmployeeData(this.listName, getItemsQuery).subscribe(
     data => {
       this.employeeData = data['value'] as employee[]; // FILL THE ARRAY WITH DATA.
       console.log(JSON.stringify(this.employeeData));
       this.dataSource = new MatTableDataSource(this.employeeData);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
       this.generatePieChart(formatDate);
     },
     (err: HttpErrorResponse) => {
       console.log(err.message);
     }
   );
 }
 private generatePieChart(formatDate?) {   
   var dateOfKPI=formatDate?formatDate:this.formatDate;
   var data=dateOfKPI.split('-');
   console.log(data[0]);
   var currentDate = new Date(data[0].toString());
   console.log(currentDate);
  var year = currentDate.getFullYear();
  console.log(year);
   this.getItemsQueryForPieChart = "?select=ID,Title,Modified,Created,Department,Relevance,Code,CoreValues,Levels,Category,KPI,Impact,Plan,Weightage,Metric,RatingDefination,RatingDefinationThree,RatingDefinationFour,Time,MidYearRating,AnnualYearRating,Created By,Modified By,"
   + "&$filter=((DepartmentId eq " + this.departmentNo +")and (GoalYear eq "+year+"))&$orderby=ID desc";
 this.dataService.getEmployeeData(this.listName1, this.getItemsQueryForPieChart).subscribe(
   data => {
     this.kpi = data['value'] as kpi[]; // FILL THE ARRAY WITH DATA.
     console.log(JSON.stringify(this.kpi));          
     var inprogress = 0;
     var completed = 0;
     var hold = 0;
     var twoRatingMid=0;
     var threeRatingMid=0;
     var fourRatingMid=0;
     var twoRatingAnnual=0;
     var threeRatingAnnual=0;
     var fourRatingAnnual=0;
     for (let i = 0; i < this.kpi.length; i++) {
       if (this.kpi[i].status === 'In Progress') {
         inprogress++;
       }
       if (this.kpi[i].status === 'Hold') {
         hold++;
       }
       if (this.kpi[i].status === 'Completed') {
         completed++;
       }
       if (this.kpi[i].MidYearRating === '2') {
         twoRatingMid++;
       }
       if (this.kpi[i].MidYearRating === '3') {
         threeRatingMid++;
       }
       if (this.kpi[i].MidYearRating === '4') {
         fourRatingMid++;
       }
       if (this.kpi[i].AnnualYearRating === '2') {
         twoRatingAnnual++;
       }
       if (this.kpi[i].AnnualYearRating === '3') {
         threeRatingAnnual++;
       }
       if (this.kpi[i].AnnualYearRating === '4') {
         fourRatingAnnual++;
       }
     }
     this.getChart(inprogress,completed,hold,twoRatingMid,fourRatingMid,threeRatingMid,twoRatingAnnual,threeRatingAnnual,fourRatingAnnual);
   },
   (err: HttpErrorResponse) => {
     console.log(err.message);
   }
 );  

}
private getChart(inprogress,completed,hold,twoRatingMid,fourRatingMid,threeRatingMid,twoRatingAnnual,threeRatingAnnual,fourRatingAnnual) {
   google.charts.load('current', { 'packages': ['corechart'] });
   google.charts.setOnLoadCallback(drawChart);

   function drawChart() {
     var data = google.visualization.arrayToDataTable([
       ['Goals Progress', 'No. Of Goals'],
       ['On Hold Goals', hold],
       ['In-Progress Goals', inprogress],
       ['Completed Goals', completed]
     ]);     
     let options = {
       title: '',
       is3D: true,
       colors: ['#F33548', '#F7F76D', '#63D856']
     };
     let options1 = {
       title: '',
       legend: 'none',
       is3D: true,
       vAxis: { title: "No. of Goals" },
       hAxis: { title: "Ratings"}
     };
     var dataBarMid = google.visualization.arrayToDataTable([
       ['No. Of Goals', 'Mid Year Rating', { role: 'style' }],
       ['2',twoRatingMid,'#F33548'],
       ['3',threeRatingMid,'#F7F76D'],
       ['4',fourRatingMid, '#63D856']
    ]);
    var dataBarAnnual = google.visualization.arrayToDataTable([
     ['No. Of Goals', 'Annual Rating', { role: 'style' }],
     ['2',twoRatingAnnual,'#F33548'],
     ['3',threeRatingAnnual,'#F7F76D'],
     ['4',fourRatingAnnual, '#63D856']
  ]);

     let chart = new google.visualization.PieChart(document.getElementById('chart_div'));

     chart.draw(data, options);
     var chart2 = new google.visualization.ColumnChart(document.getElementById('chart_div_rating_mid'));
     chart2.draw(dataBarMid,options1);
     var chart3 = new google.visualization.ColumnChart(document.getElementById('chart_div_rating_annual'));
     chart3.draw(dataBarAnnual,options1);
   }
 }

}
