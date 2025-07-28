import { Injectable } from '@angular/core';
import * as devtoolsDetector from 'devtools-detector';

@Injectable({
  providedIn: 'root'
})
export class DevToolsService {
  private devToolsDetected = false;


  // constructor() {
  //   if(environment.isBlockInspact){
  //     this.detectDevTools();
  //   }
  // }

  // private detectDevTools() {
  //   debugger
  //   let devtools = {
  //     open: false,
  //     orientation: null
  //   };
  //   const threshold = 160;
  //   const emitEvent = (isOpen: boolean, orientation: string | null) => {
  //     window.dispatchEvent(new CustomEvent('devtoolschange', {
  //       detail: {
  //         open: isOpen,
  //         orientation: orientation
  //       }
  //     }));
  //   };
  //   const checkDevTools = () => {
  //     const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  //     const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  //     const orientation = widthThreshold ? 'vertical' : 'horizontal';

  //     if (!(heightThreshold && widthThreshold) &&
  //       ((window as any).Firebug && (window as any).Firebug.chrome && (window as any).Firebug.chrome.isInitialized || widthThreshold || heightThreshold)) {
  //       if (!devtools.open || devtools.orientation !== orientation) {
  //         emitEvent(true, orientation);
  //       }
  //       devtools.open = true;
  //       devtools.orientation = orientation;
  //     } else {
  //       if (devtools.open) {
  //         emitEvent(false, null);
  //         // Reload the page when devtools are closed
  //         location.reload();
  //       }
  //       devtools.open = false;
  //       devtools.orientation = null;
  //     }
  //   };

  //   checkDevTools();

  //   setInterval(checkDevTools, 500);

  //   if(devtools.open){
  //     document.body.innerHTML = 'Inspect is not allowed.';
  //   }
  //   window.addEventListener('devtoolschange', (event: any) => {
  //     if (event.detail.open) {
  //       document.body.innerHTML = 'Inspect is not allowed.';
  //     } else {
  //       document.body.innerHTML = 'Back to the E-Signatuer.';
  //       location.reload();
  //     }
  //   });
  // }

  public checkDev(){
    devtoolsDetector.addListener((isOpen)=>{
      if(isOpen){
        this.handleDevToolsOpen();
      }else{
        this.handleDevToolsClose();
      }
    })
    devtoolsDetector.launch();
  }


  //  // This method accepts a callback that will receive the DevTools open/close status
  //  detectDevTools(callback: (isOpen: boolean) => void): void {
  //   // Ensure devtoolsDetector is available
  //   if (devtoolsDetector && typeof devtoolsDetector.addListener === 'function') {
  //     // Add a listener to detect changes in DevTools state
  //     devtoolsDetector.addListener((isOpen: boolean) => {
  //       debugger
  //       if(isOpen){
  //         this.handleDevToolsOpen();
  //       }else{
  //         this.handleDevToolsClose();
  //       }
  //       callback(isOpen); // Pass the DevTools state to the callback
  //     });

  //     // Start the detection
  //     devtoolsDetector.launch();
  //   } else {
  //     console.error('DevTools detector not available or incorrect version.');
  //   }
  // }

  // constructor() {
  //   if (environment.production) {
  //     // detectDevTools.((isOpen:any) => {
  //     debugger
  //       if (this.detectDevTools.isOpen) {
  //         console.log('DevTools are open');
  //       } else {
  //         console.log('DevTools are closed');
  //       }
  //     // });
  //     // this.startCheckingDevTools();
  //   }
  // }

  // private startCheckingDevTools() {
  //   setInterval(() => {
  //     this.checkDebugger().then(result => {
  //       console.log('Debugger check result:', result);
  //       if (result) {
  //         this.handleDevToolsOpen();
  //       } else {
  //         this.handleDevToolsClose();
  //       }
  //     });
  //   }, 1000); // Check every second
  // }

  // private checkDebugger(): Promise<boolean> {
  //   let workerUrl = 'data:application/javascript;base64,' + btoa(`
  //     self.addEventListener('message', (e) => {
  //       if(e.data==='hello'){
  //         self.postMessage('hello');
  //       }
  //       debugger;
  //       self.postMessage('');
  //     });
  //   `);

  //   return new Promise((resolve) => {
  //     let fulfilled = false;
  //     let worker = new Worker(workerUrl);
  //     worker.onmessage = (e) => {
  //       let data = e.data;
  //       if (data === 'hello') {
  //         setTimeout(() => {
  //           if (!fulfilled) {
  //             resolve(true);
  //             worker.terminate();
  //           }
  //         }, 1);
  //       } else {
  //         fulfilled = true;
  //         resolve(false);
  //         worker.terminate();
  //       }
  //     };
  //     worker.postMessage('hello');
  //   });
  // }

  private handleDevToolsOpen() {
    if (!this.devToolsDetected) {
      this.devToolsDetected = true;
      console.log('Developer tools are open.');
      document.body.innerHTML = 'Inspect is not allowed. Please close the DevTools.';
    }
  }

  private handleDevToolsClose() {
    if (this.devToolsDetected) {
      this.devToolsDetected = false;
      console.log('Developer tools are closed.');
      location.reload();
    }
  }
}
