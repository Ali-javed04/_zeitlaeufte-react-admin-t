import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substring'
})
export class SubstringPipe implements PipeTransform {

  transform(text: string, args: any[], removeDecimal: boolean): any {
    let limit = 0;
    let start = 0;
    let concat = true;
    // console.log("Substring Args: " + JSON.stringify(args));
    if (args[0]) {
      limit = args[0];
    }
    if (args[1]) {
      start = Number(args[1]);
    }
    if (args[2]) {
      concat = <boolean>args[2];
    }
    // console.log("Limit: " + limit + " | Start: " + start + " | Concat: " + concat);
    if (text && limit != 0 && text.length > limit) {
      return text.trim().substring(start ? start : 0, limit - 2) + (concat == true ? '...' : '');
    }
    if (removeDecimal && text.includes(".")) {
      text = text.split(".")[0];
    }
    return text;
  }
}
