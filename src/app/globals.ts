// globals.ts
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class SharedService {
  hideToolbar: EventEmitter<any> = new EventEmitter();
  onPageNav: EventEmitter<any> = new EventEmitter();
  canEdit: EventEmitter<any> = new EventEmitter();
  addSection: EventEmitter<any> = new EventEmitter();
  addName: EventEmitter<any> = new EventEmitter();
}

@Injectable()
export class PreDefined {
  wikiCountry = [
    {
      title : 'Communication',
      markup : 'How much service is there for american carriers? What local carriers work well? What is the process to get cellular ' +
        'data, if it is available? How common is internet access?'
    },
    {
      title: 'Customs',
      markup: 'What did you bring through customs? How did you get that medical equipment to your site? Was anything confiscated? ' +
        'Did you work with customs before departing to ensure your stuff will make it? If so, please detail that process.'
    },
    {
      title: 'Contacts',
      markup: 'Were there any local, government or non-government, organizations you found useful? If so how did they help you? What ' +
        'was the relationship like? What is their contact info? '
    },
    {
      title: 'Transit',
      markup: 'How did you get from the airport, or port, to the site? Is the public transportation systems reliable? Can you drive ' +
        'yourself, or did you book transportation? What was your preferred method for traveling between cities?'
    },
    {
      title: 'Culture',
      markup: 'What cultural taboos should staff be aware of? Is there anything common in western culture that would offend locals? ' +
        'Conversely, what cultural customs do they have which might offend staff? How did you deal with it? '
    },
    {
      title: 'Money',
      markup: 'Is the US dollar preferred? If no, where did you exchange currency? Is card taken or is it a primarily cash society? ' +
        'Did you take all your cash at once, or did you continuously withdraw smaller amounts? If so, where did you withdraw cash from?'
    },
    {
      title: 'Comfort_and_Availability',
      markup: 'What comforts and necessities did you miss while in this country? What was readily available? ' +
        'What should staff bring to stay comfortable during their trips?'
    },
    {
      title: 'Crimes_and_Scams',
      markup: 'What is the crime rate like? What scams will staff run across? Are foreigners more likely to be targeted?'
    },
    {
      title: 'Population_Health',
      markup: 'What level of care does the population generally receive? Is any type of care noticeably lacking? ' +
        'What health issues seem to be common in this country?'
    }
  ];

  wikiSite = [
    {
      title: 'Pharmaceutical',
      markup: 'Is there a place to get drugs nearby? How accessible are the drugs? If you do not bring everything you need,' +
        ' or run out, what is the process for getting more?'
    },
    {
      title: 'Assistance',
      markup: 'What level of assistance can you expect form local staff? What types of training will the staff have?'
    },
    {
      title: 'Conditions',
      markup: 'Is the water drinkable? Can it be used for medical purposes? Do they have constant electricity?' +
        ' If not, do they have backup generators?'
    },
    {
      title: 'Technology',
      markup: 'What level of technology do they have, and what is the condition of the Technology. ' +
        'Do they Have a dedicated maintenance team? Is there a Lab/OR/Imaging/Etc. What are the hours? How is this technology managed?'
    },
    {
      title: 'Security',
      markup: 'How secure is the site? Is there on staff security at all hours? Should staff avoid leaving alone?'
    },
    {
      title: 'Living_and_Transportation',
      markup: 'What is nearby accommodation? Should staff live near the site, ' +
        'or somewhere else? How should staff commute the site, walk, transit, or cars?'
    },
    {
      title: 'Patient_Traffic',
      markup: 'Give a breakdown of the types of operations performed on a day to day basis. ' +
        'What is this site equipped to handle? What do they struggle with?'
    }
  ];

  wikiTrip = [
    {
      title: 'Trip Experiences',
      markup: 'Is there a place to get drugs nearby? How accessible are the drugs? If you do not bring everything you need,' +
        ' or run out, what is the process for getting more?'
    },
    {
      title: 'Assistance',
      markup: 'What level of assistance can you expect form local staff? What types of training will the staff have?'
    },
    {
      title: 'Conditions',
      markup: 'Is the water drinkable? Can it be used for medical purposes? Do they have constant electricity?' +
        ' If not, do they have backup generators?'
    },
    {
      title: 'Technology',
      markup: 'What level of technology do they have, and what is the condition of the Technology. ' +
        'Do they Have a dedicated maintenance team? Is there a Lab/OR/Imaging/Etc. What are the hours? How is this technology managed?'
    },
    {
      title: 'Security',
      markup: 'How secure is the site? Is there on staff security at all hours? Should staff avoid leaving alone?'
    },
    {
      title: 'Living_and_Transportation',
      markup: 'What is nearby accommodation? Should staff live near the site, ' +
        'or somewhere else? How should staff commute the site, walk, transit, or cars?'
    },
    {
      title: 'Patient_Traffic',
      markup: 'Give a breakdown of the types of operations performed on a day to day basis. ' +
        'What is this site equipped to handle? What do they struggle with?'
    }
  ];

  wikiOrg = [
    {
      title: 'ORG_Categories?',
      markup: 'Is there a place to get drugs nearby? How accessible are the drugs? If you do not bring everything you need,' +
        ' or run out, what is the process for getting more?'
    },
    {
      title: 'Assistance',
      markup: 'What level of assistance can you expect form local staff? What types of training will the staff have?'
    },
    {
      title: 'Conditions',
      markup: 'Is the water drinkable? Can it be used for medical purposes? Do they have constant electricity?' +
        ' If not, do they have backup generators?'
    },
    {
      title: 'Technology',
      markup: 'What level of technology do they have, and what is the condition of the Technology. ' +
        'Do they Have a dedicated maintenance team? Is there a Lab/OR/Imaging/Etc. What are the hours? How is this technology managed?'
    },
    {
      title: 'Security',
      markup: 'How secure is the site? Is there on staff security at all hours? Should staff avoid leaving alone?'
    },
    {
      title: 'Living_and_Transportation',
      markup: 'What is nearby accommodation? Should staff live near the site, ' +
        'or somewhere else? How should staff commute the site, walk, transit, or cars?'
    },
    {
      title: 'Patient_Traffic',
      markup: 'Give a breakdown of the types of operations performed on a day to day basis. ' +
        'What is this site equipped to handle? What do they struggle with?'
    }
  ];
}
