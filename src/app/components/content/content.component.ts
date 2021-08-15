import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConstants } from 'src/app/constants/globalConstants';
import { DataService } from 'src/app/services/data.service';
import { employee } from 'src/app/model/employee';
import { MatDialog, MatInput, MatPaginator, MatSelect, MatSort, MatTableDataSource } from '@angular/material';
import {Router} from '@angular/router';
import { kpi } from 'src/app/model/kpi';
import { DialogBoxDashboardComponent } from '../dialog-box-dashboard/dialog-box-dashboard.component';
declare let google: any;
interface blogspot {
  value: string;
  viewValue: string;
}
   
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit,AfterViewInit {
  title = 'app-material3';  
  listName = "Employees";
  listName1 = "EmployeesKPI";
  listName2 ="YearList";
  kpi: kpi[];
  getItemsQuery =  "";
  getItemsQueryForPieChart="";
  selectedCriteria: String;
  pageofblogs: blogspot[] = [];
  departmentNo: Number;
  employeeData1: string;
  employeeData: employee[];
  displayedColumns: string[] = ['ID', 'Title'];
  d = new Date();
  goalYears=[];
  chartData={};
  formatDate = this.d.getFullYear() + '-' +  (this.d.getMonth() + 1)+ '-' +this.d.getDate() +'T00:00:00.000Z';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("fff") nameField: ElementRef;
  rowObj: any;
  constructor(private router: Router,public dialog: MatDialog,private route: ActivatedRoute,private httpService: HttpClient,private dataService:DataService) {}
  ngAfterViewInit(): void {
  }
  ngOnInit() {   
    window.scrollTo(0, 0);
    this.dataService.getGoalYears(this.listName2).subscribe(
      data => {
        this.goalYears = data['value'];
        for(let i=0;i<this.goalYears.length;i++){
          var year=this.goalYears[i]['Year'].split('-');
          this.pageofblogs.push({value: year[1], viewValue: this.goalYears[i]['Year']});
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );  
    var d = new Date();
    this.selectedCriteria= d.getFullYear().toString();
    this.route.data.subscribe((data:Data) =>{
      console.log(data);
      this.departmentNo = data['dept'];
    })
    
    this.getItemsQuery =  "?select=ID,Title,Modified,Created,DepartmentName,DepartmentNumber,EmployeeJoiningDate,EmployeeReleavingDate,EmployeeId,"
    +"&$filter=((EquipmentNumber eq "+this.departmentNo+") and (DQIQNumberGivenDate le datetime'"+this.formatDate+"'))&$orderby=ID desc";
     this.getEmployees(this.getItemsQuery);
}
 
openDialog(action, obj) {
  this.rowObj = obj;
  obj.action = action;
  obj.chartData=this.chartData;
  const dialogRef = this.dialog.open(DialogBoxDashboardComponent, {
    width: '1500px',
    data: obj
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result.event == 'Add') {
     // this.addRowData(result.data, result.file);
    } else if (result.event == 'Update') {
     // this.updateRowData(result.data, result.file, result.deleteFile);
    } else if (result.event == 'Delete') {
      //this.deleteRowData(result.data);
    }
  });
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
          this.chartData={
          'inprogress':inprogress,
          'completed':completed,
          'hold':hold,
          'twoRatingMid':twoRatingMid,
          'fourRatingMid':fourRatingMid,
          'threeRatingMid':threeRatingMid,
          'twoRatingAnnual':twoRatingAnnual,
          'threeRatingAnnual':threeRatingAnnual,
          'fourRatingAnnual':fourRatingAnnual
        };
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
        is3D: true
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

clickEvent(element){
  this.router.navigate(['/kpi',element.EmployeeId,element.Title,this.departmentNo,this.selectedCriteria]);
}
applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
onSelectValueChange () {
  console.log(this.selectedCriteria);
  console.log('Type of Selection => ', typeof this.selectedCriteria);
  var currentDate = new Date();
  var formatDate;
  if(currentDate.getFullYear().toString()!==this.selectedCriteria.toString()){
      currentDate = new Date(this.selectedCriteria.toString());
      currentDate.setMonth(11);
      currentDate.setDate(31);
  }
  formatDate = currentDate.getFullYear() + '-' +  (currentDate.getMonth() + 1)+ '-' +currentDate.getDate() +'T00:00:00.000Z';
  var getItemsQuery =  "?select=ID,Title,Modified,Created,DepartmentName,DepartmentNumber,EmployeeJoiningDate,EmployeeReleavingDate,EmployeeId,"
  +"&$filter=((EquipmentNumber eq "+this.departmentNo+") and (DQIQNumberGivenDate le datetime'"+formatDate+"'))&$orderby=ID desc";
   this.getEmployees(getItemsQuery,formatDate);  
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

}