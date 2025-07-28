import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-legal-disclamer',
  templateUrl: './legal-disclamer.component.html',
  styleUrls: ['./legal-disclamer.component.scss']
})
export class LegalDisclamerComponent extends Softcafe implements Service, OnInit {

  permission = AppPermission;
  legalFile: any;
  file: any;
  // file: File;
  loading: boolean = true;

  constructor(
    private cs: CommonService,
    public permissionStoreServoce: PermissioinStoreService,
    private ds: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadLegalDisclamer();
  }

  loadLegalDisclamer() {
    let payload = {
      configSubGroup: 'LEGAL_DISCLAIMER',
    }
    // this.loading = true;
    this.cs.sendRequest(this, ActionType.SELECT_ALL_LEGAL, ContentType.DocumentFiles, 'select', payload);
  }

  base64toFile(base64Data: string, filename: string): File {
    // Remove the prefix from the base64 string
    const base64WithoutPrefix = base64Data.split(';base64,')[1];
    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Change the type according to your file type
    return new File([blob], filename, { type: 'application/pdf' }); // Change the type according to your file type
  }


// downloadFile() {
//   if (!this.legalFile?.base64File) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'No document available',
//       text: 'Document not found or still loading',
//       timer: 3000
//     });
//     return;
//   }

//   const linkSource = this.legalFile.base64File;
//   const downloadLink = document.createElement('a');
//   downloadLink.href = linkSource;
//   downloadLink.download = this.legalFile.fileName;
//   downloadLink.click();
// }



  onResponse(service: Service, req: any, res: any) {
    this.loading = false;
    debugger
    if (!super.isOK(res)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `${super.getErrorMsg(res)}`,
        timer: 5000,
      }).then(() => { return });
      return;
    } else if (res.header.referance === 'select') {
      const value = res.payload;
      if (value instanceof Array) {
        this.legalFile = value[0];
      } else {
        this.legalFile = value;
      }
      if(!this.legalFile){
        return;
      }
//new
       const byteCharacters = atob(this.legalFile.base64File.split(',')[1]);
       const byteNumbers = new Array(byteCharacters.length);
       for (let i = 0; i < byteCharacters.length; i++) {
         byteNumbers[i] = byteCharacters.charCodeAt(i);
       }
       const byteArray = new Uint8Array(byteNumbers);
       const blob = new Blob([byteArray], { type: 'application/pdf' });
       
       const url = URL.createObjectURL(blob) + '#toolbar=1&download=1';
       this.file = this.ds.bypassSecurityTrustResourceUrl(url);
     }

 //old
    //   let f = this.base64toFile(this.legalFile?.base64File, this.legalFile?.fileName);
    //   // this.file = this.base64toFile(this.legalFile?.base64File, this.legalFile?.fileName);

    //   let reader = new FileReader();
    //   // reader.onload = res => {
    //   //   this.file = res.target.result;
    //   // }
    //   reader.onload = (res) => {
    //     // If you want to display it in an iframe, use createObjectURL
    //     const blob = new Blob([res.target.result], { type: f.type });
    //     const url = URL.createObjectURL(blob);
  
    //     // Assuming pdfSrc is the variable holding the URL to display the PDF
    //     this.file = this.ds.bypassSecurityTrustResourceUrl(url);
  
    //     // Optional: Revoke the Object URL after using it to free up memory
    //     reader.onloadend = () => {
    //       URL.revokeObjectURL(url);
    //     };
    //   };
    //   reader.readAsArrayBuffer(f);
    // }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
