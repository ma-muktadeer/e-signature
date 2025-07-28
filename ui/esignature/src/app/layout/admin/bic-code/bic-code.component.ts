import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, GridOption } from 'angular-slickgrid';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { AppGridService } from 'src/app/softcafe/service/app-grid.service';
import { AddBicComponent } from './add-bic/add-bic.component';

@Component({
  selector: 'app-bic-code',
  templateUrl: './bic-code.component.html',
  styleUrls: ['./bic-code.component.scss']
})
export class BicCodeComponent extends Softcafe implements OnInit, Service {

  bicList = []

  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;

  constructor(public appGridService: AppGridService) { 
    super();
  }

  ngOnInit(): void {

    this.prepareGrid();
    this.gridOptions = this.appGridService.gridOptions;

    this.buildGridOption();
  }

  prepareGrid(){
    this.columnDefinitions =[
      {
        id : "swiftBicCodeKey", field:"swiftBicCodeKey", name: "", width:0, maxWidth:0, minWidth:0, excludeFromGridMenu:true, excludeFromHeaderMenu:true
      },
      {
        id : "bicCode", field:"bicCode", name: "BIC Code"
      },
      {
        id : "branchName", field:"branchName", name: "Branch Name"
      },
      {
        id : "bankName", field:"bankName", name: "Bank Name"
      },
      {
        id : "bankCity", field:"bankCity", name: "Bank City"
      },
      {
        id : "bankCountry", field:"bankCountry", name: "Country"
      },
    ];
  }

  buildGridOption(){
    this.gridOptions.datasetIdPropertyName = 'id';
    this.gridOptions.multiSelect = true;

  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;

    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;

    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);
  }

  onBicAdd(){
    /* const dialogRef = this.dialog.open(AddBicComponent, {
      width: '750px',
      height : "500px",
      data: {
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    }); */
  }


  


  onResponse(service: Service, req: any, response: any) {
    if (response.header.referance == 'select') {
      if (response.payload.length > 0) {
        this.bicList = response.payload;
      }
      else {
      }
    }
  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

}
