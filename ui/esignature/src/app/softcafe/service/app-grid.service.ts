import { Injectable } from '@angular/core';
import { GridOption } from 'angular-slickgrid';

@Injectable({
  providedIn: 'root'
})
export class AppGridService {

  gridOptions : GridOption = {
    datasetIdPropertyName: "branchId",
    enableAutoResize: true,
    enableSorting: true,
    enableRowSelection: true,
    enableCellNavigation: true,
    enableCheckboxSelector: true,
    defaultFilter: true,
    multiSelect: false,
    editable: true,
    autoEdit: true,
    enableFiltering: true,
    autoCommitEdit: true,
    forceFitColumns: true, // this one is important        
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false
    },
    autoTooltipOptions: {
      enableForCells: true,
      enableForHeaderCells: true,
      maxToolTipLength: 200

    },
    enablePagination : true,
    pagination: {
      pageNumber: 1,
      pageSizes: [25, 50, 75, 100, 150, 500],
      pageSize: 25
    },
    
  }

  constructor() { }
}
