import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegexFormValidationService {
  constructor() {
    this.initValue()
  }
  regexName
  regexEmail
  regexPhoneNumber
  regexNumericNumber
  regexTemplate
  allPhoneNumber: any;

  regexList(r) {
    debugger
    if (r.length == 0) {
      return null;
    }
    const serializedData = JSON.stringify(r);

    localStorage.setItem('dataValidationRegex', serializedData);
    this.initValue();
  }

  initValue() {
    var regex = localStorage.getItem('dataValidationRegex');
    console.log(regex)
    if (regex) {
      var data = JSON.parse(regex);
      this.regexName = data.find(x => x.name == 'name');
      this.regexEmail = data.find(x => x.name == 'email');
      this.regexPhoneNumber = data.find(x => x.name == 'phoneNumber');
      this.regexNumericNumber = data.find(x => x.name == 'numericNumber');
      this.regexTemplate = data.find(x => x.name == 'template');
      this.allPhoneNumber = data.find(x => x.name == 'allPhoneNumber');
    }
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      
      const regex = new RegExp(this.regexName.regex);
      const value = control.value as string;
      return this.isCheckValidator(regex, value);
    };
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = new RegExp(this.regexEmail.regex);
      const value = control.value as string;
      return this.isCheckValidator(regex, value);
    };
  }
  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = new RegExp(this.regexPhoneNumber.regex);
      const value = control.value as string;
      return this.isCheckValidator(regex, value);
    };
  }
  allPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = new RegExp(this.allPhoneNumber.regex);
      const value = control.value as string;
      return this.isCheckValidator(regex, value);
    };
  }

  numericNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // const regex = /^[0-9]+$/;
      const regex = new RegExp(this.regexNumericNumber.regex);
      const value = control.value as string;
      return this.isCheckValidator(regex, value);
    };
  }

  templateValidator(name: string): boolean {
    debugger
    var afterRemoveUnwantedPatterns = this.removeUnwantedPatterns(name)
    // when i use this ; character it automatic accept <> "" & this character
    const ltGtpatterns = ['&gt&lt', '&lt&gt', '&gt', '&lt'];
    for (const pattern of ltGtpatterns) {
      if (afterRemoveUnwantedPatterns.includes(pattern)) {
        return false;
      }
    }
    const regex = new RegExp(this.regexTemplate.regex);
    return regex.test(afterRemoveUnwantedPatterns);
  }

  removeUnwantedPatterns(name) {
    name = name.replace(/[\u2018\u2019\u201A\u201B]/g, "'"); 
    name = name.replace(/[\u201C\u201D\u201E]/g, '"');
    const fontRegex = /<font face="Arial">(.*?)<\/font>/g;
    name = name.replace(fontRegex, (_, content) => content);
    const pRegex = /<p[^>]*>(.*?)<\/p>/g;
    name = name.replace(pRegex, (_, content) => content);
    const spanRegex = /<span[^>]*>(.*?)<\/span>/g;
    name = name.replace(spanRegex, (_, content) => content);
    const underlineRegex = /<u[^>]*>(.*?)<\/u>/g;
    name = name.replace(underlineRegex, (_, content) => content);
    const italicRegex = /<i[^>]*>(.*?)<\/i>/g;
    name = name.replace(italicRegex, (_, content) => content);
    const strikeRegex = /<strike[^>]*>(.*?)<\/strike>/g;
    name = name.replace(strikeRegex, (_, content) => content);
    const subRegex = /<sub[^>]*>(.*?)<\/sub>/g;
    name = name.replace(subRegex, (_, content) => content);
    const supRegex = /<sup[^>]*>(.*?)<\/sup>/g;
    name = name.replace(supRegex, (_, content) => content);
    const blockquoteRegex = /<blockquote[^>]*>(.*?)<\/blockquote>/g;
    name = name.replace(blockquoteRegex, (_, content) => content);
    const ulRegex = /<ul[^>]*>(.*?)<\/ul>/g;
    name = name.replace(ulRegex, (_, content) => content);
    const uRegex = /<u[^>]*>(.*?)<\/ul>/g;
    name = name.replace(uRegex, (_, content) => content);
    const liRegex = /<li[^>]*>(.*?)<\/li>/g;
    name = name.replace(liRegex, (_, content) => content);
    const olRegex = /<ol[^>]*>(.*?)<\/ol>/g;
    name = name.replace(olRegex, (_, content) => content);
    const h1Regex = /<h1[^>]*>(.*?)<\/h1>/g;
    name = name.replace(h1Regex, (_, content) => content);
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/g;
    name = name.replace(h2Regex, (_, content) => content);
    const h3Regex = /<h3[^>]*>(.*?)<\/h3>/g;
    name = name.replace(h3Regex, (_, content) => content);
    const h4Regex = /<h4[^>]*>(.*?)<\/h4>/g;
    name = name.replace(h4Regex, (_, content) => content);
    const h5Regex = /<h5[^>]*>(.*?)<\/h5>/g;
    name = name.replace(h5Regex, (_, content) => content);
    const h6Regex = /<h6[^>]*>(.*?)<\/h6>/g;
    name = name.replace(h6Regex, (_, content) => content);
    const h7Regex = /<h7[^>]*>(.*?)<\/h7>/g;
    name = name.replace(h7Regex, (_, content) => content);
    const preRegex = /<pre[^>]*>(.*?)<\/pre>/g;
    name = name.replace(preRegex, (_, content) => content);
    const fontSizeRegex = /<font[^>]*>(.*?)<\/font>/g;
    name = name.replace(fontSizeRegex, (_, content) => content);
    name = name.replace(fontSizeRegex, (_, content) => content);
    const divTagRegex = /<div[^>]*>(.*?)<\/div>/g;
    name = name.replace(divTagRegex, '');
    const aTagRegex = /<a[^>]*>(.*?)<\/a>/g;
    name = name.replace(aTagRegex, '');

    name = name.replace(/<br\s*\/?>/g, '');
    name = name.replace(/<hr\s*\/?>/g, '');
    name = name.replace(/<img[^>]*>/g, '');
    name = name.replace(/&#160;/g, '');
    name = name.replace(/&amp;/g, '');
    name = name.replace(/;/g, '');

    return name.replace(/\n/g, ' ');
  }


  isCheckValidator(regex, value) {
    if (!value) {
      return null;
    }

    if (!regex.test(value)) {
      return { invalidRegex: true };
    }

    return null;
  }

}