import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNoSpecialCharacters]'
})
export class NoSpecialCharactersDirective {
  @Input('appNoSpecialCharacters') inputType: inputText = 'text';
  private dataValidationRegex: any;
  constructor() {
    this.dataValidationRegex = JSON.parse(localStorage.getItem('dataValidationRegex'));
  }


  // private regex: RegExp = new RegExp('^[a-zA-Z0-9 ]*$'); // Allow letters, numbers, and spaces only
  private regex: RegExp; 

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    this.regex = this.buildRegex(this.dataValidationRegex);

    // Get the pressed key
    const inputKey = event.key;

    // Allow certain control keys (backspace, delete, arrow keys, etc.)
    if (this.isControlKey(event)) {
      return;
    }

    // If the key doesn't match the regex, prevent the default behavior (block the key)
    if (!this.regex.test(inputKey) && inputKey != 'v') {
      event.preventDefault();
    }
  }

  buildRegex(dataValidationRegex: any): RegExp {
    if (dataValidationRegex) {
      return new RegExp(dataValidationRegex.find(s => s.name == this.inputType)?.regex ?? '^[a-zA-Z0-9-@_ .]*$');
    } else {
      return new RegExp('^[a-zA-Z0-9-@_ .]*$');
    }
  }

  @HostListener('input', ['$event'])
  onPasteE(event: InputEvent) {
    let htmlInput = event.target as HTMLInputElement;
    // if(this.inputType === 'text' || this.inputType === 'name'){
    //   event.preventDefault(); // Block paste action

    // }

    let regex = this.buildRegex(this.dataValidationRegex);
    // const invalidText = new RegExp(`[^${regex.source.split(/[\[\]]/g)[1]}]`, 'g');
    const invalidText = new RegExp(`[^${regex.source.replace(/^\^|[$]/g, '')}]`, 'g');
    debugger
    htmlInput.value = htmlInput.value.replace(invalidText, '');

  }

  private isControlKey(event: KeyboardEvent): boolean {
    // Allow backspace, delete, tab, enter, arrow keys, etc.
    const controlKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Tab', 'Enter', 'Escape', 'Control', 'Shift', 'Meta'
    ];

    return controlKeys.includes(event.key);
  }
}

export type inputText = 'text' | 'name' | 'email' | 'numericNumber' | 'template';

