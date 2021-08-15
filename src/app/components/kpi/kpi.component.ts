import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { UploadService } from 'src/app/services/upload.service';
import { filter, map } from 'rxjs/operators';
import { from, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { kpi } from 'src/app/model/kpi';
export interface UsersData {
  name: string;
  id: number;
  file: string;
}

const ELEMENT_DATA: UsersData[] = [
  { id: 1560608769632, name: 'Artificial Intelligence', file: 'Document Ref' },
  { id: 1560608796014, name: 'Machine Learning', file: 'Document Ref' },
  { id: 1560608787815, name: 'Robotic Process Automation', file: 'Document Ref' },
  { id: 1560608805101, name: 'Blockchain', file: 'Document Ref' },
  { id: 1560608769632, name: 'Artificial Intelligence', file: 'Document Ref' },
  { id: 1560608796014, name: 'Machine Learning', file: 'Document Ref' },
  { id: 1560608787815, name: 'Robotic Process Automation', file: 'Document Ref' },
  { id: 1560608805101, name: 'Blockchain', file: 'Document Ref' },
  { id: 1560608769632, name: 'Artificial Intelligence', file: 'Document Ref' },
  { id: 1560608796014, name: 'Machine Learning', file: 'Document Ref' },
  { id: 1560608787815, name: 'Robotic Process Automation', file: 'Document Ref' },
  { id: 1560608805101, name: 'Blockchain', file: 'Document Ref' }
];
@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css']
})
export class KpiComponent implements OnInit, OnDestroy {
  @ViewChild("fileInput") fileInput: ElementRef;
  files = [];
  listName = "EmployeesKPI";
  EmployeeId = "";
  EmployeeName = "";
  getItemsQuery = "";
  displayedColumns: string[] = ['ID', 'Relevance', 'Code', 'Core_x0020_Values', 'Levels', 'Category', 'KPI', 'Impact', 'Plan', 'Weightage', 'Metric', 'status','RatingDefination','RatingDefinationThree','RatingDefinationFour','Time','MidYearRating','AnnualYearRating', 'file', 'action'];
  dataSource = [];
  paramsSubscription: Subscription;
  kpi: kpi[];
  @ViewChild(MatTable) table: MatTable<any>;
  rowObj: any;
  EmployeeDepartmentId: any;
  EmployeeJoiningDate: any;
  departmentNo: any;
  ID: any;
  constructor(private router: Router, public dialog: MatDialog, private uploadService: UploadService, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.EmployeeId = this.route.snapshot.params['EmployeeId'];
    this.EmployeeName = this.route.snapshot.params['EmployeeName'];
    this.EmployeeDepartmentId = this.route.snapshot.params['EmployeeDepartmentId'];
    this.EmployeeJoiningDate = this.route.snapshot.params['EmployeeJoiningDate'];



    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.EmployeeId = params['EmployeeId'];
          this.EmployeeName = params['EmployeeName'];
          this.EmployeeDepartmentId = params['EmployeeDepartmentId'];
          this.EmployeeJoiningDate = params['EmployeeJoiningDate'];

        }
      );

    this.refreshGridData();
  }
  private refreshGridData() {
    this.getItemsQuery = "?select=ID,Title,Modified,Created,Department,Relevance,Code,Core_x0020_Values,Levels,Category,KPI,Impact,Plan,Weightage,Metric,status,RatingDefination,RatingDefinationThree,RatingDefinationFour,Time,MidYearRating,AnnualRating,Created By,Modified By,"
      + "&$filter=((EmployeeId eq " + this.EmployeeId + ")and (GoalYear eq " + this.EmployeeJoiningDate + "))&$orderby=ID desc";

    this.dataService.getEmployeeData(this.listName, this.getItemsQuery).subscribe(
      data => {
        this.kpi = data['value'] as kpi[];
        for (let i = 0; i < this.kpi.length; i++) {
          if (this.kpi[i]['fileNames'] !== "") {
            this.kpi[i]['fileNames'] = this.kpi[i]['fileNames'].split(',');
            this.kpi[i]['index'] = i+1;
          }
        }
        this.dataSource = this.kpi;
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  

  openDialog(action, obj) {
    this.rowObj = obj;
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '1000px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addRowData(result.data, result.file);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data, result.file, result.deleteFile);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }
  getFileNames(file) {
    var fileName = "";
    for (let i = 0; i < file.length; i++) {
      if (i !== 0) {
        fileName = fileName + "," + file[i].data.name;
      }
      else {
        fileName = file[i].data.name;
      }
    }
    return fileName;
  }
  addRowData(row_obj, file) {
    console.log(row_obj);
    console.log(file);
    row_obj.EmployeeId = this.EmployeeId;
    row_obj.EmployeeName = this.EmployeeName;
    row_obj.DepartmentId = this.EmployeeDepartmentId;
    row_obj.GoalYear = this.EmployeeJoiningDate;
    row_obj.fileNames = this.getFileNames(file);
    row_obj.Time=new Date(row_obj.Time);
    this.dataService.setEmployeeData(row_obj, this.listName).subscribe(
      data => {
        this.ID = data['d']['ID'];	 // FILL THE ARRAY WITH DATA.
        console.log(JSON.stringify(this.kpi));
        this.upload(file, this.ID);
        //this.refreshGridData();     
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
    // var d = new Date();
    // this.dataSource.push({
    //   id:d.getTime(),
    //   name:row_obj.name,
    //   file:row_obj.file
    // });
    this.table.renderRows();

  }
  updateRowData(row_obj, file, deleteFile) {
    if(deleteFile.length>0 && file.length>0){
      this.dataService.deleteattachmentByFileName(this.listName, row_obj.ID.toString(), deleteFile).subscribe(
        data => {
          this.dataService.uploadAttachmentByFileNames(this.listName,row_obj.ID.toString(),file,false).subscribe(
            data => {            
                this.editItemMethod(row_obj, file, deleteFile);   
            },
            (err: HttpErrorResponse) => {
              console.log(err.message);
            });
        },
        (err: HttpErrorResponse) => {
          console.log(err.message);
        });
    }
    if(deleteFile.length==0 && file.length>0){
      this.dataService.uploadAttachmentByFileNames(this.listName,row_obj.ID.toString(),file,false).subscribe(
        data => {            
            this.editItemMethod(row_obj, file, deleteFile);   
        },
        (err: HttpErrorResponse) => {
          console.log(err.message);
        });
    }
    if(deleteFile.length>0 && file.length==0){
      this.dataService.deleteattachmentByFileName(this.listName, row_obj.ID.toString(), deleteFile).subscribe(
        data => {            
            this.editItemMethod(row_obj, file, deleteFile);   
        },
        (err: HttpErrorResponse) => {
          console.log(err.message);
        });
    }
    if(deleteFile.length==0 && file.length==0){
      this.editItemMethod(row_obj, file, deleteFile);   
    }
  }
  private editItemMethod(row_obj: any, file: any, deleteFile: any) {
    this.dataService.readItem(this.listName, this.rowObj.ID).subscribe(
      data => {
        var etag = data['d'].__metadata.etag;
        // row_obj['Core_x0020_Values']="";
        row_obj.Time=new Date(row_obj.Time);
        row_obj['Title'] = "";
        row_obj['fileNames'] = this.getFinalFileNamesAfterEdit(row_obj.fileNames, file, deleteFile);
        this.dataService.editEmployeeData(this.listName, this.rowObj.ID, row_obj, etag).subscribe(
          data => {
            this.refreshGridData();
          },
          (err: HttpErrorResponse) => {
            console.log(err.message);
          }
        );
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  getFinalFileNamesAfterEdit(currentFileNamesArray, file, deleteFile) {
    console.log("-----"+currentFileNamesArray+"-----"+file+"-----"+deleteFile);
    var currentFileNames=currentFileNamesArray.join(',');
    var fileName = "";
    if (file.length > 0 && deleteFile.length > 0) {
        for (let j = 0; j < file.length; j++) {
          if(currentFileNamesArray.includes(file[j].data.name)){
              continue;
          }
          else{
            currentFileNames=currentFileNames+','+file[j].data.name;
          }
          
        }
        fileName=currentFileNames;      
    }
    else if (file.length == 0 && deleteFile.length > 0) {    
      fileName = currentFileNames;
    }
    else if (file.length > 0 && deleteFile.length == 0) {
      var iniFileNames = [];
      for (let j = 0; j < file.length; j++) {
        if(currentFileNamesArray.includes(file[j].data.name)){
            continue;
        }
        else{
          iniFileNames.push(file);
        }
        
      }
      if(iniFileNames.length>0){
        fileName = currentFileNames+','+this.getFileNames(iniFileNames);
      }
      else{
        fileName = currentFileNames;
      }
      
    }
    else{
      fileName = currentFileNames;
    }
    return fileName;
  }
  private deleteAttachment(rowObj, fileName) {
    this.dataService.DeleteListItemAttachment(this.listName, rowObj.ID.toString(), fileName).subscribe(
      data => {
        for (let i = 0; i < this.files.length; i++) {
          if (this.files[i] == fileName) {
            this.files.splice(i, 1);
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      });
  }

  deleteRowData(row_obj) {
    this.dataService.removeEmployeeData(this.listName, this.rowObj.ID).subscribe(
      data => {
        this.refreshGridData();
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }
  callUploadService(file, id?) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.dataService.uploadAttach(this.listName, id.toString(), file.data.name, file.data, false).subscribe(
      data => {
        this.refreshGridData();
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      });
  }


  private upload(files?, id?) {
    var files = files ? files : this.files;
    files.forEach(file => {
      this.callUploadService(file, id);
    });
  }

  onClick(id) {
    const fileInput = this.fileInput.nativeElement;
    fileInput.onchange = () => {
      for (let index = 0; index < fileInput.files.length; index++) {
        const file = fileInput.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.upload(this.files, id);
    };
    fileInput.click();
  }
  getFileUrl(element, file) {
    return "https://granulesomnichem.sharepoint.com/teams/Applications/Lists/EmployeesKPI/Attachments/" + element.ID + "/" + file;
  }
  goToDashboard() {
    this.router.navigate(['/dashboard', this.EmployeeId, this.EmployeeName, this.EmployeeDepartmentId, this.EmployeeJoiningDate]);
  }
  goToHome() {
    this.router.navigate(['']);
  }
  isDashboardAvailable() {
    if (this.dataSource.length > 0) {
      return true;
    }
    return false;
  }
  onPrevious() {
    this.router.navigate(['/depatrment-' + this.EmployeeDepartmentId]);
  }
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}



