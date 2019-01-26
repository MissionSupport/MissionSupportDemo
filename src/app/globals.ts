// globals.ts
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class SharedService {
  onMainEvent: EventEmitter<any> = new EventEmitter();
  onPageNav: EventEmitter<any> = new EventEmitter();
}

@Injectable()
export class PreDefined {
  wikiCountry = {
    Communication: 'How much service is there for american carriers? What local carriers work well? What is the proccess to get cellular ' +
      'data, if it is available? How common is internet access?',
    Customs: 'What did you bring through customs? How did you get that medical equipment to your site? Was anything confiscated? ' +
      'Did you work with customs before departing to ensure your stuff will make it? If so, please detail that proccess.',
    Contacts: 'Were there any local, government or non-government, organizations you found useful? If so how did they help you? What ' +
      'was thye realtionship like? What is their contact info? ',
    Transit: 'How did you get from the airport, or port, to the site? Is the public transportation systems relaible? Can you drive ' +
      'yourself, or did you book transportatiopn? What was your prefered method for traveling between cities?',
    Culture: 'What cultural taboos should staff be aware of? Is there anything common in western culture that would offend locals? ' +
      'Conversely, what cultural customs do they have which might offend staff? How did you deal with it? ',
    Money: 'Is the US dollar prefereed? If no, where did you exchange currency? Is card taken or is it a primarily cash society? ' +
      'Did you take all your cash at once, or did you continuosly withdraw smaller amounts? If so, where did you withdraw cash from?',
    Comfort_and_Availability: 'What comforts and nesecities did you miss while in this country? What was readily available? ' +
      'What should staff bring to stay comfortable during their trips?',
    Crimes_and_Scams: 'What is the crime rate like? What scams will staff run across? Are foriegners more likely to be targeted?',
    Population_Health: 'What level of care does the population generally recieve? Is any type of care noticably lacking? ' +
      'What health issues seem to be common in this country?'
  };

  wikiSite = {
    Pharmacuetical: 'Is there a place to get drugs nearby? How accessible are the drugs? If you do not bring everything you need,' +
      ' or run out, what is the process for getting more?',
    Assistence: 'What level of assistence can you expect form local staff? What types of training will the staff have?',
    Conditions: 'Is the water drinkable? Can it be used for medical purposes? Do they have constant electricity?' +
      ' If not, do they have backup generators?',
    Technology: 'What level of technology do they have, and what is the condition of the Technology. ' +
      'Do they Have a dedicated maintence team? Is there a Lab/OR/Imaging/Etc. What are the hours? How is this techoology managed?',
    Security: 'How secure is the site? Is there on staff security at all hours? Should staff avoid leaving alone?',
    Living_and_Transportation: 'What is nearby accomodation? Should staff live near the site, ' +
      'or somewhere else? How should staff commute the site, walk, transit, or cars?',
    Patient_Traffic: 'Give a breakdown of the types of operations performed on a day to day basis. ' +
      'What is this site equipped to handle? What do they struggle with?'
  };
}
