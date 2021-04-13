import { Pipe,PipeTransform} from '@angular/core';
import * as moment from 'moment';

declare var $;

@Pipe({name : 'fromNow'})
export class FromNowPipe implements PipeTransform{
    transform(value: string):string {
       return moment.utc(value).local().fromNow();
    //    return moment(value).fromNow();
    }
}