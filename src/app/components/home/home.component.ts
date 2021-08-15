import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bootstrap } from 'angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userProfile=[];
  userAccessCheck=false;
  userName="";
  departmentNo:any;
  isSpinnerOn=false;
  accessMatrix={"1":"ICT","2":"HRM","3":"QC","4":"FIN","5":"QAS","6":"QCO","7":"PRD","8":"SHE","9":"ENG","10":"Sales","11":"RnD","12":"MKT","13":"PUR","14":"OEX"};
  slides = [

    {'image': '../../../assets/1.jpg'}, 

    {'image': '../../../assets/2.jpg'},

    {'image': '../../../assets/3.jpg'}, 

    {'image': '../../../assets/4.jpg'}, 

    {'image': '../../../assets/5.jpg'}

  ];
  constructor(private dataService:DataService,private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    
  }
  getDepartment(userProfile: any[]) {
    for(let i=0;i<userProfile.length;i++){
        if(userProfile[i].Key==="FirstName"){
            console.log("getDepartment returns"+userProfile[i].Value);
            return userProfile[i].Value;
        }
    }
  }
  getAccessFromSharepointGroup(groupName){
    this.dataService.getUserByGroup(groupName).subscribe(
      (data) => {
        this.checkUserAccess(data['d']['results']); 
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
      );      
  }
  checkUserAccess(usersArray: any) {
  this.dataService.getMyProfile().subscribe(
    (data) => {
        this.userProfile=data['d']["UserProfileProperties"]["results"];
        var userName=this.getDepartment(this.userProfile);
        this.matchUser(userName,usersArray);   
        if(this.userAccessCheck){
          this.isSpinnerOn=false
          this.router.navigate(['/depatrment-'+this.departmentNo]);
        }
      else{
        this.isSpinnerOn=false;
        this.router.navigate(['/errorPage']);
      }
          
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    }
    );  
   
  }
  matchUser(userName:string,usersArray) {
    console.log("matchUser parameter"+userName);
    console.log("matchUser parameter"+usersArray);
    var name1:string='';
    var name2:string='';
    for(let i=0;i<usersArray.length;i++){
      name1=usersArray[i]['Title'];
      name2=userName.toString().trim();
      console.log("name1"+name1);
      console.log("name2"+name2);
      console.log("matchUser condition-"+name1.toString().trim()===name2);
      if(name1.toString().trim()===name2){        
        this.userAccessCheck= true;
      }
      console.log("matchUser results-"+this.userAccessCheck);
  }
  return  this.userAccessCheck;
  }
  onDepartmentClick(departmentNo:any){
    this.isSpinnerOn=true;
    this.departmentNo=departmentNo;
    this.getAccessFromSharepointGroup(this.accessMatrix[departmentNo]);   
  }
  

}

