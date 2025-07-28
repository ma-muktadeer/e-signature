import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { forkJoin } from 'rxjs';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-common-search',
  templateUrl: './common-search.component.html',
  styleUrls: ['./common-search.component.scss']
})
export class CommonSearchComponent implements OnInit {
  @Output()
  onSearch: EventEmitter<any> = new EventEmitter<any>();

  @Input('isShow')
  public isShow: boolean = false;
  @Input('allowInstitutionSearch')
  public allowInstitutionSearch: boolean = false;
  @Input()
  public searchFrom: string;
  @Input('institutionList')
  public institutionList: any = [];
  @Input()
  public showProgress: boolean= false;

  employeeId: string;
  pa: string;
  email: string;
  name: string;
  institutionId: number = null;
  institutionName: string;
  loaderConfig: any = {
    loader: 'twirl',
    position: 'right',
    color: 'white',
    background: '#fff',
    padding: '10px',
    height: .6,
    opacity: 1,
    speed: 1000,
    padButton: true,
  }
  
  appPermission = AppPermission;;
  // institutionList: any[];


  constructor(private cs: CommonService,private permissionStorageService: PermissioinStoreService) {

  }

  ngOnInit(): void {
    if (this.institutionList.length <= 0 && this.allowInstitutionSearch) {
      this.loadValue();
    }
    debugger
  }


  toggleCollapse() {
    this.isShow = !this.isShow;
  }
  loadValue() {

    const value = forkJoin([this.loadInstitution()])
      .subscribe((res: any) => {
        this.institutionList = res[0]?.payload;
        debugger
        if (this.permissionStorageService.hasPermission(this.appPermission.HR_ROLE) && !this.cs.forceAllow()) {
          this.institutionList = this.institutionList.filter(m => m.institutionName.toUpperCase().includes('PRIME BANK'));
        }
        console.log('institution list: ', this.institutionList);

      });
  }
  dropdownSettingsInstitution: IDropdownSettings = {
    singleSelection: true,
    idField: 'institutionId',
    textField: 'institutionName',
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
    searchPlaceholderText: 'Search Institution',
    noDataAvailablePlaceholderText: 'No institution found',
  };

  getInstitutionIdS(event: any) {
    this.institutionId = event.institutionId;
    console.log('selectedInstitutionId', this.institutionId);
}
  loadInstitution() {
    const payload = {
      // institutionId: this.user?.institutionId,
    }
    return this.cs.execute(ActionType.SELECT, ContentType.Institution, payload);
  }
  deselect(event: any) {
    this.institutionId = null;
  }
  search() {
    if (this.name && this.name.length < 3) {
      this.showProgress = false;
       Swal.fire({
              icon: 'warning',
              title: 'Invalid Input',
              text: 'Name must be at least 3 characters long.',
              confirmButtonText: 'OK',
            });
            return;
  }
    this.institutionName = this.institutionList?.find(f => f.institutionId == this.institutionId)?.institutionName;
    const payload = {
      showProgress : true,
      pa: this.pa,
      employeeId: this.employeeId,
      email: this.email,
      name:this.name,
      institutionId: this.institutionId,
      institutionName: this.institutionName,
    };
 this.showProgress = payload.showProgress;
    this.onSearch.emit(payload);

    // setTimeout(() => {
    //   this.showProgress = false;
    // }, 1500); 
  }



}
