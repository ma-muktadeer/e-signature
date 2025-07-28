import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateConvertService {

  constructor(private datePipe: DatePipe) { }

  convertDb2Date(dbDateString: string, format: string = 'yyyy-MM-dd'): string | null {
    if (!dbDateString) {
      return null;
    }
    let dateObject: Date | null = null;

    // ISO format (includes 'T')
    if (dbDateString.includes('T')) {
      dateObject = new Date(dbDateString);
    } else {
      // Try to handle custom date format 'dd-MM-yyyy HH:mm:ss'
      const customFormatMatch = dbDateString.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/);
      if (customFormatMatch) {
        const [_, day, month, year, hours, minutes, seconds] = customFormatMatch.map(Number);
        dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
      } else {
        // Handle textual date formats like "Jun 26, 2024"
        const textualDateMatch = dbDateString.match(/^[a-zA-Z]{3,} \d{1,2}, \d{4}$/);
        if (textualDateMatch) {
          dateObject = new Date(dbDateString);
        }
      }
    }

    // If dateObject is not valid, return the original string
    if (!dateObject || isNaN(dateObject.getTime())) {
      return dbDateString;
    }

    // Use datePipe to format the dateObject
    // const options: Intl.DateTimeFormatOptions = {};
    // if (format.includes('yyyy')) options.year = 'numeric';
    // if (format.includes('MM')) options.month = '2-digit';
    // if (format.includes('dd')) options.day = '2-digit';
    // if (format.includes('HH')) options.hour = '2-digit';
    // if (format.includes('mm')) options.minute = '2-digit';
    // if (format.includes('ss')) options.second = '2-digit';

    // return new Intl.DateTimeFormat('en-US', options).format(dateObject);
    return this.datePipe.transform(dateObject, format);
  }

}
