import { Injectable } from '@angular/core';
import { Column, FieldType, Filters, Formatter } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignatoryService {
  statusFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any)=>{
    
    if(dataContext?.status === 'APPROVED'){
      return `<button class="btn btn-success py-0">${blockToCamel(dataContext?.status)}</button>`;
    }
    return blockToCamel(dataContext?.status);
  };

  constructor() { }
  private getDefaultHeaderMenu() {
    return {
      menu: {
        items: [
          {
            iconCssClass: 'fa fa-sort-asc',
            title: 'Sort Ascending',
            command: 'sort-asc'
          },
          {
            iconCssClass: 'fa fa-sort-desc', 
            title: 'Sort Descending',
            command: 'sort-desc'
          }
        ]
      }
    };
  }
  public getGridColumn() {
    const isFilterable = environment.enableFiltering;
    const columns: Column[] = [
      {
        id: 'employeeId',
        name: 'Employee ID',
        field: 'employeeId',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        minWidth: 150,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'name',
        name: 'Name',
        field: 'name',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        minWidth: 150,
        header: this.getDefaultHeaderMenu(),
        // maxWidth: 100,
        
        resizable: true,
        rerenderOnResize: false,
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'pa',
        name: 'PA Number',
        field: 'pa',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        minWidth: 150,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'institutionName',
        name: 'Institution Name',
        field: 'institutionName',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        width: 200,
        minWidth: 150,
        // maxWidth: 100,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'designation',
        name: 'Designation',
        field: 'designation',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        width: 70,
        minWidth: 170,
        header: this.getDefaultHeaderMenu(),
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
        resizable: true,
        rerenderOnResize: false,
      },
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        minWidth: 250,
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
      },
      {
        id: 'approval',
        name: 'Approval',
        field: 'approval',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        width: 120,
        maxWidth: 120,
        minWidth: 120,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
      },
      {
        id: 'nid',
        name: 'NID',
        field: 'nid',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        minWidth: 120,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
      },
      {
        id: 'contactNumber',
        name: 'Phone Number',
        field: 'contactNumber',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        minWidth: 120,
        resizable: true,
        rerenderOnResize: false,
      },
      {
        id: 'department',
        name: 'Department',
        field: 'department',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        width: 80,
        maxWidth: 120,
        minWidth: 80,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
        
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'address',
        name: 'Address',
        field: 'address',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: {model: Filters.inputText},
        // width: 100,
        // maxWidth: 100,
        minWidth: 100,
        resizable: true,
        rerenderOnResize: false,
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'status',
        name: 'Status',
        field: 'status',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        formatter: this.statusFormatter,
        filter: {model: Filters.inputText},
        // width: 100,
        // maxWidth: 100,
        minWidth: 100,
        resizable: true,
        rerenderOnResize: false,
        header: this.getDefaultHeaderMenu(),
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      
      
    ];
    return columns;
  }
}
