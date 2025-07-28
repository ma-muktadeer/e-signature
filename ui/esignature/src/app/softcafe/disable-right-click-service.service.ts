import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppPermission, PermissioinStoreService } from '../service/permissioin-store.service';

@Injectable({
  providedIn: 'root'
})
export class DisableRightClickServiceService {
  private isWindowsKeyPressed = false;
  private appPermission = AppPermission;
  private renderer: Renderer2;
  private isShiftKeyPressed = false;
  constructor(@Inject(DOCUMENT) private document: Document, private permissionService: PermissioinStoreService,
    private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  disableRightClick() {
    if (environment.disableRightClick) {
      this.renderer.listen(this.document, 'contextmenu', (event) => event.preventDefault());

      this.document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.metaKey) {
          console.log('Blur effect triggered due to key combination Shift + Meta + S');
          this.addBlur();
          event.preventDefault();
        }
        if (event.key === 'Meta' || event.key === 'Windows') {
          this.isWindowsKeyPressed = true;
        }
        if (event.key === 'Shift') {
          this.isShiftKeyPressed = true;
        }

        // Keep blur active for Windows+Shift+S combination
        if (this.isWindowsKeyPressed && this.isShiftKeyPressed && event.key.toLowerCase() === 's') {
          this.addBlur();
          this.preventScreenshot();
          event.preventDefault();
        }
        else if (
          (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) || // DevTools shortcuts
          (event.ctrlKey && event.key === 'u') // View Source shortcut
        ) {
          event.preventDefault();
        }
        else if (event.shiftKey && event.metaKey && event.key === 'S') {
          console.log('Blur effect triggered due to key combination Shift + Meta + S');
          this.addBlur();
          event.preventDefault();
        }
        else if (event.key === 'PrintScreen' || (event.metaKey && event.key === 'PrintScreen')) {

          this.preventScreenshot();
          event.preventDefault();
        }
        if (event.key === 'Meta' || event.key === 'Windows') {
          this.isWindowsKeyPressed = true;
          this.addBlur();
        }

        if (event.key === 'PrintScreen' ||
          (this.isWindowsKeyPressed && event.key === 'PrintScreen') ||
          (event.shiftKey && this.isWindowsKeyPressed && event.key === 's')) {
          this.preventScreenshot();
          this.addBlur();
          event.preventDefault();
        }
      });


      // Prevent PrintScreen (KeyCode 44)
      this.document.addEventListener('keyup', (event: KeyboardEvent) => {
        console.log('Keyup event detected:', event.key);
        if (event.metaKey) {
          console.log('Blur effect triggered due to key combination Shift + Meta + S');
          this.removeBlur();
          event.preventDefault();
        }
        if (event.key === 'Meta' || event.key === 'Windows') {
          this.isWindowsKeyPressed = false;
        }
        if (event.key === 'Shift') {
          this.isShiftKeyPressed = false;
        }
        // Add mouse event listeners to remove blur
        this.document.addEventListener('mousedown', () => {
          this.isWindowsKeyPressed = false;
          this.isShiftKeyPressed = false;
          this.removeBlur();
        });

        this.document.addEventListener('click', () => {
          this.isWindowsKeyPressed = false;
          this.isShiftKeyPressed = false;
          this.removeBlur();
        });
        // Only remove blur when all keys are released
        if (!this.isWindowsKeyPressed && !this.isShiftKeyPressed) {
          this.removeBlur();
        }
        else if (event.shiftKey && event.metaKey && event.key === 'S') {
          console.log('Blur effect triggered due to key combination Shift + Meta + S');
          event.preventDefault();
          this.addBlur();
        }
        if (event.key === 'Meta' || event.key === 'Windows') {
          this.isWindowsKeyPressed = false;
          this.removeBlur();
        }
      });

      //   // Handle when browser loses focus
      //   window.addEventListener('blur', () => {
      //     console.log('Browser lost focus. Content blurred.');
      //     this.addBlur();
      //   });

      //   // Handle when browser regains focus
      //   window.addEventListener('focus', () => {
      //     console.log('Browser regained focus. Content unblurred.');
      //     this.removeBlur();
      //   });
    }

  }

  private addBlur() {
    this.renderer.addClass(this.document.body, 'blur-effect');
  }

  // Remove the blur effect
  private removeBlur() {
    this.renderer.removeClass(this.document.body, 'blur-effect');
  }

  private preventScreenshot() {
    console.log('PrintScreen detected. Reapplying prevention.');
    const textToCopy = 'Screenshot prevention activated!';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('Clipboard content overwritten successfully.');
      }).catch((err) => {
        console.error('Failed to overwrite clipboard content: ', err);
      });
    } else {
      console.warn('Clipboard API not supported in this browser.');
    }

  }

  disableCopy(event: Event) {
    if (environment.disableRightClick) {
      if (!this.permissionService.hasPermission(this.appPermission.COPY_TEXT)) {
        console.log("desable text selection....");
        event.preventDefault();
      }
    }
  }
}
