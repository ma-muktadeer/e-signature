import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-download-info',
  templateUrl: './download-info.component.html',
  styleUrls: ['./download-info.component.scss']
})
export class DownloadInfoComponent implements OnInit {


  allowedFileTypes = ['.doc', '.docx', '.txt', '.pdf', '.png', '.jpeg', '.gif', '.bmp', '.webp'];

  @Output()
  onSubmit: EventEmitter<any> = new EventEmitter<any>();

  // @Input()
  // isFull: boolean = false;

  file: any;
  institutionName: any;
  referralNumber: any;
  documentDate: any;
  remark: any;
  tooltip: string = 'Cancel';

  constructor(
    private activeModel: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  otherFile(files: any, elRef: any) {
    const file = files[0];
    debugger
    if (file) {
      const fileExtension = '.' + file.name.split('.').pop();
      if (this.allowedFileTypes.indexOf(fileExtension) === -1) {
        Swal.fire(`${fileExtension.substring(1, fileExtension.length)} is not allowed.`);
        elRef.value = '';
        return;
      }
      else {
        this.file = file;
      }
    }

  }

  submit() {
    const payload = {
      file: this.file,
      institutionName: this.institutionName,
      referralNumber: this.referralNumber,
      remark: this.remark,
      documentDate: this.documentDate,
      // isFull: this.isFull,
    }
    // this.onSubmit.emit(payload);
    this.closeModel(payload);
  }

  closeModel(res?: any) {
    this.activeModel.close(res);
  }
}
