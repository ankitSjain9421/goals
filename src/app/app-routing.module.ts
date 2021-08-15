import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { EmployeekpiComponent } from './components/employeekpi/employeekpi.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { KpiComponent } from './components/kpi/kpi.component';

const routes: Routes = [
   { path: '', component: HomeComponent},
   { path: 'teams/Applications/SiteAssets/todo/index.aspx', component: HomeComponent},
   { path: 'depatrment-1', component: ContentComponent,data :{ dept:1} },
   { path: 'depatrment-2', component: ContentComponent,data :{ dept:2} },
   { path: 'depatrment-3', component: ContentComponent,data :{ dept:3} },
   { path: 'depatrment-4', component: ContentComponent,data :{ dept:4} },
   { path: 'depatrment-5', component: ContentComponent,data :{ dept:5} },
   { path: 'depatrment-6', component: ContentComponent,data :{ dept:6} },
   { path: 'depatrment-7', component: ContentComponent,data :{ dept:7} },
   { path: 'depatrment-8', component: ContentComponent,data :{ dept:8} },
   { path: 'depatrment-9', component: ContentComponent,data :{ dept:9} },
   { path: 'depatrment-10', component: ContentComponent,data :{ dept:10} },
   { path: 'depatrment-11', component: ContentComponent,data :{ dept:11} },
   { path: 'depatrment-12', component: ContentComponent,data :{ dept:12} },
   { path: 'depatrment-13', component: ContentComponent,data :{ dept:13} },
   { path: 'depatrment-14', component: ContentComponent,data :{ dept:14} },
   { path: 'dashboard/:EmployeeId/:EmployeeName/:EmployeeDepartmentId/:EmployeeJoiningDate', component: EmployeekpiComponent},
   { path: 'errorPage', component: ErrorComponent},
   { path: 'kpi/:EmployeeId/:EmployeeName/:EmployeeDepartmentId/:EmployeeJoiningDate', component: KpiComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
