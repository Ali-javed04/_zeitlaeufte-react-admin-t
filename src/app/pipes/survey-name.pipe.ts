import { Pipe,PipeTransform} from '@angular/core';

@Pipe({name : 'surveyName'})
export class SurveyNamePipe implements PipeTransform{
    transform(value: string):string {
        if(value == 'Ads_Survey'){
            return 'Ads Survey';
        }
        else if(value == 'Consumers_Survey'){
            return 'Consumers Survey';
        }
        else if(value == 'Products_Survey'){
            return 'Product Survey';
        }
        else if(value == 'Voters_Survey'){
            return 'Voter Survey';
        }
        else if(value=='Politicals_Survey'){
            return 'Politicals Survey'
        }
        return value;
    }
}