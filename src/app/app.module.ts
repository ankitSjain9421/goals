import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Material Module
import { MaterialModule } from './material';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatGridListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatTabsModule, MatOptionModule, MatProgressSpinnerModule, MatNativeDateModule } from  '@angular/material';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { HttpClientModule } from '@angular/common/http';
import { KpiComponent } from './components/kpi/kpi.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { EmployeekpiComponent } from './components/employeekpi/employeekpi.component';
import { ErrorComponent } from './components/error/error.component';
import {MatDatepickerModule} from '@angular/material';
import { DialogBoxDashboardComponent } from './components/dialog-box-dashboard/dialog-box-dashboard.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    KpiComponent,
    DialogBoxComponent,
    HomeComponent,
    EmployeekpiComponent,
    ErrorComponent,
    DialogBoxDashboardComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule ,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    HttpClientModule,
    MatOptionModule,  
    MatTabsModule ,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatCarouselModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogBoxComponent,
    DialogBoxDashboardComponent
  ]
})
export class AppModule { }
