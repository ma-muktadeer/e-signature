import { Injectable } from '@angular/core';
import { Column, FieldType, Filters, Formatter } from 'angular-slickgrid';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {

  status: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    if(dataContext.status == 'APPROVED'){
      // return dataContext.signatureStatus ;
      return blockToCamel(dataContext.signatureStatus) ;
    }
    else{
      return blockToCamel(dataContext.status);
    }
  };
  constructor() { }

  public getGridColumn() {
    const isFilterable = environment.enableFiltering;
    const columns: Column[] = [
      {
        id: 'pa',
        name: 'PA',
        field: 'pa',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        width: 120,
        maxWidth: 220,
        minWidth: 120,
        resizable: false,
        focusable: false,
        selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'employeeId',
        name: 'Employee ID',
        field: 'employeeId',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        minWidth: 150,
        resizable: false,
        focusable: false,
        selectable: false
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
        filter: { model: Filters.inputText },
        width: 160,
        maxWidth: 160,
        minWidth: 160,
        resizable: false,
        focusable: false,
        selectable: false
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
        filter: { model: Filters.inputText },
        minWidth: 170,
        resizable: false,
        focusable: false,
        selectable: false
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
        filter: { model: Filters.inputText },
        width: 160,
        maxWidth: 160,
        minWidth: 160,
        resizable: false,
        focusable: false,
        selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'signatureStatus',
        name: 'Status',
        field: 'signatureStatus',
        formatter: this.status,
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        width: 130,
        maxWidth: 130,
        minWidth: 130,
        resizable: false,
        focusable: false,
        selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'effictiveDate',
        name: 'Effictive Date',
        field: 'effictiveDate',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        width: 170,
        maxWidth: 170,
        minWidth: 170,
        resizable: false,
        focusable: false,
        selectable: false,
        formatter: (row, cell, value) => {
          if (value) {
              return value.substring(0, 10);
          }
          return value;
      }
      //   formatter: (row, cell, value) => {
      //     if (value) {
      //         return value.split(' ')[0];
      //     }
      //     return value;
      // }
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        width: 250,
        maxWidth: 250,
        minWidth: 250,
        resizable: false,
        focusable: false,
        selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'rejectionCause',
        name: 'Rejection Cause',
        field: 'rejectionCause',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        width: 220,
        maxWidth: 220,
        minWidth: 220,
        resizable: false,
        focusable: false,
        selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },
      {
        id: 'modDate',
        name: 'Modify Date',
        field: 'modDate',
        sortable: true,
        type: FieldType.text,
        filterable: isFilterable,
        filter: { model: Filters.inputText },
        width: 180,
        maxWidth: 180,
        minWidth: 180,
        resizable: false,
        focusable: false,
        selectable: false
        // params: {useFormatterOuputToFilter: true},
        // formatter: this.directionFormatter,
      },


    ];
    return columns;
  }
}
