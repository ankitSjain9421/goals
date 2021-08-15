import { Component } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'Header';
  isLoaderEnable=false;
  constructor(private router: Router) {}
  goToDepartment(path){
    this.isLoaderEnable=true;
    setTimeout(function() {  
      this.isLoaderEnable=false;        
      this.router.navigateByUrl('/'+path);
     }, 5000);
  }
  goHome(){       
      this.router.navigateByUrl('/');    
  }
}