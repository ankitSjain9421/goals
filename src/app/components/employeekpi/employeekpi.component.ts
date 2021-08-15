import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from 'src/app/constants/globalConstants';
import { DataService } from 'src/app/services/data.service';
import { employee } from 'src/app/model/employee';
import { MatInput, MatPaginator, MatSelect, MatSort, MatTableDataSource } from '@angular/material';
import {Router} from '@angular/router';
import { kpi } from 'src/app/model/kpi';
declare let google: any;
interface blogspot {
  value: string;
  viewValue: string;
}
   
@Component({
  selector: 'app-content',
  templateUrl: './employeekpi.component.html',
  styleUrls: ['./employeekpi.component.css']
})
export class EmployeekpiComponent implements OnInit,AfterViewInit {
  title = 'app-material3';  
  listName = "Employees";
  listName1 = "EmployeesKPI";
  kpi: kpi[];
  numOfKpis=0;
  midScore=0;
  annualScore=0;
  getItemsQuery =  "";
  getItemsQueryForPieChart="";
  selectedCriteria: String;
  pageofblogs: blogspot[] = [
    {value: '2019', viewValue: '2019'},
    {value: '2020', viewValue: '2020'},
    {value: '2021', viewValue: '2021'}
  ];
  departmentNo: Number;
  employeeData1: string;
  employeeData: employee[];
  displayedColumns: string[] = ['ID', 'Title', 'Department'];
  d = new Date();
  formatDate = this.d.getFullYear() + '-' +  (this.d.getMonth() + 1)+ '-' +this.d.getDate() +'T00:00:00.000Z';
  dataSource = new MatTableDataSource();
  @ViewChild("fff") nameField: ElementRef;
  EmployeeId: any;
  paramsSubscription: any;
  EmployeeJoiningDate: any;
  EmployeeName: any;
  EmployeeDepartmentId: any;
  constructor(private router: Router,private route: ActivatedRoute,private httpService: HttpClient,private dataService:DataService) {}
  ngAfterViewInit(): void {
  }
  ngOnInit() {
    window.scrollTo(0, 0);   
    this.EmployeeId=this.route.snapshot.params['EmployeeId'];
    this.EmployeeName=this.route.snapshot.params['EmployeeName'];
    this.EmployeeDepartmentId=this.route.snapshot.params['EmployeeDepartmentId'];
    this.EmployeeJoiningDate=this.route.snapshot.params['EmployeeJoiningDate'];
  
    
 
    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.EmployeeId= params['EmployeeId'];
          this.EmployeeName= params['EmployeeName'];
          this.EmployeeDepartmentId= params['EmployeeDepartmentId'];
          this.EmployeeJoiningDate= params['EmployeeJoiningDate'];
      
        }
      );
 
 
    var d = new Date();
    this.selectedCriteria= d.getFullYear().toString();
    this.route.data.subscribe((data:Data) =>{
      console.log(data);
      this.departmentNo = data['dept'];
    })
     this.getEmployees(this.EmployeeJoiningDate);
}
 
  private generatePieChart(formatDate?) { 
       var currentDate = new Date(formatDate.toString());
       var year = currentDate.getFullYear();
        this.getItemsQueryForPieChart = "?select=ID,Title,Modified,Created,Department,Relevance,Code,CoreValues,Levels,Category,KPI,Impact,Plan,Weightage,Metric,RatingDefination,RatingDefinationThree,RatingDefinationFour,Time,MidYearRating,AnnualYearRating,Created By,Modified By,"
        + "&$filter=((EmployeeId eq " + this.EmployeeId +")and (GoalYear eq "+year+"))&$orderby=ID desc";
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
          this.numOfKpis=this.kpi.length;
          for (let i = 0; i < this.kpi.length; i++) {
           var  numMidRating=+this.kpi[i].MidYearRating;
           var  numAnnualYearRating=+this.kpi[i].AnnualYearRating;
           this.midScore=this.midScore+numMidRating;
           this.annualScore=this.annualScore+numAnnualYearRating;
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

  


private getEmployees(formatDate?) {
  this.generatePieChart(formatDate);  
}
onPrevious(){
  this.router.navigate(['/kpi',this.EmployeeId,this.EmployeeName,this.EmployeeDepartmentId,this.EmployeeJoiningDate]);
}
}