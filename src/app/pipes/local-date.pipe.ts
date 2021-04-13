import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

declare var $;

@Pipe({ name: 'localDate' })
export class LocalDatePipe implements PipeTransform {
    transform(value: string, format: string): string {
        return moment.utc(value).local().format(format);
        //    return moment(value).fromNow();
    }
}