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
      title: 'Purpose',
      markup: 'What was the purpose of the trip? Was it Successful?'
    },
    {
      title: 'Type of Care',
      markup: 'What type of care were you providing? Why did you choose to do that type? Is that type of care available,' +
        ' or were you providing access to normally unavailable services?'
    },
    {
      title: 'Preparation',
      markup: 'How many people did you bring? Did you follow thge site checklist? Where did you stay?'
    },
    {
      title: 'Unique Challenges',
      markup: 'What unique challenges did you run into? Could future groups encounter the same issue? If so, how would you' +
        ' recommend future groups approach this problem?'
    },
    {
      title: 'Contact',
      markup: 'Please leave a contact person who can answer follow up questions about the trip'
    }
  ];

  wikiOrg = [
    {
      title: 'About Us',
      markup: 'General information about the organization: size, location, funding, purpose, etc. '
    },
    {
      title: 'Types of Care Provided',
      markup: 'Do you specialize in specific services? If so, what?'
    },
    {
      title: 'Contact Info',
      markup: 'Contact information'
    }
  ];

  hospitalJson = [
    {
      key: 'textBox1',
      label: 'Hospital Name',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox2',
      label: 'Name of Host',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox3',
      label: 'Position at Hospital',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox4',
      label: 'Host Email Address',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'email'
    },
    {
      key: 'textBox5',
      label: 'Host Phone Number',
      controlType: 'textbox',
      gridSize: 'p-col-6'
    },
    {
      key: 'textBox6',
      label: 'Number of Beds (Total Hospital)',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'pnum'
    },
    {
      key: 'textBox7',
      label: 'Number of Med/Surg Beds',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'pnum'
    },
    {
      key: 'textBox8',
      label: 'Number of Operating Rooms',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'pnum'
    },
    {
      key: 'textBox9',
      label: 'Number of Clinic Rooms (Available for surgery)',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'pnum'
    },
    {
      key: 'radio1',
      label: 'PCAU?',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio2',
      label: 'Pre-op?',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    }
  ];
  hospitalInfrastructureJson = [
    {
      key: 'radio1',
      label: 'What is your primary source of electricity',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: 'City Grid', value: 'City Grid'},
        {key: 'Generator', value: 'Generator'}
      ]
    },
    {
      key: 'radio2',
      label: 'Power outlets located on wards?',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor1',
      label: 'What is your back-up power supply in case of power outage?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio3',
      label: 'Do you have a generator available 24/7?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'textBox1',
      label: 'Comments about generator/electricity',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'radio4',
      label: 'Do you have running water available 24/7?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio5',
      label: 'Do you have scrub sinks?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor2',
      label: 'Comments about access to water/sinks?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio6',
      label: 'Is there a pharmacy on site?',
      controlType: 'radio',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
  ];

  pharmacyLabJson = [
    {
      key: 'textBox1',
      label: 'Pharmacy Hours - Weekends',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox2',
      label: 'Pharmacy Hours - Weekdays',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'header1',
      label: 'What kind of medications do you keep in stocp? (avalibable 100% of the time)',
      controlType: 'header',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmultcheck1',
      label: 'Antibiotics (which ones? PO/IV)',
      controlType: 'medmultcheck',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmultcheck2',
      label: 'Analgesics (which ones? PO/IV) ',
      controlType: 'medmultcheck',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmultcheck3',
      label: 'General Anesthetics? (which ones?)',
      controlType: 'medmultcheck',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmultcheck4',
      label: 'Paralytics (which ones?)',
      controlType: 'medmultcheck',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmultcheck5',
      label: 'Anti-hypertensives? (which ones?)',
      controlType: 'medmultcheck',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmultcheck6',
      label: 'Vasopressors/Inotropes (which ones?)',
      controlType: 'medmultcheck',
      gridSize: 'p-col-12'
    },
    {
      key: 'medmulttextbox1',
      label: 'Others? Please List',
      controlType: 'medmulttextbox',
      gridSize: 'p-col-12'
    },
    {
      key: 'editor1',
      label: 'Comments on Medication Supply',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio6',
      label: 'Is there a lab on site?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'multi1',
      label: 'Lab Capabilities (select all that apply)',
      controlType: 'multi',
      gridSize: 'p-col-6',
      options: [
        {key: 'chem_7', value: 'Chem 7'},
        {key: 'chem_14', value: 'Chem 14 '},
        {key: 'cbc', value: 'CBC'},
        {key: 'abg', value: 'ABG'},
        {key: 'ua', value: 'UA'},
        {key: 'blood_urine_culture', value: 'Blood/Urine Culture'}
      ]
    },
    {
      key: 'textBox3',
      label: 'Lab Hours - Weekends',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox4',
      label: 'Lab Hours - Weekdays',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor2',
      label: 'If no lab available, where do patients get them done?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio7',
      label: 'Is there a blood bank available on site?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'textBox5',
      label: 'If no blood available on site, where is the blood bank?',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox6',
      label: 'How long does it take to obtain blood products?',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'radio8',
      label: 'Is there a imagine on site?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'multi1',
      label: 'Lab Capabilities (select all that apply)',
      controlType: 'multi',
      gridSize: 'p-col-6',
      options: [
        {key: 'x_ray', value: 'X-ray'},
        {key: 'ultrasound', value: 'ultrasound'},
        {key: 'ct_scan', value: 'CT Scan'}
      ]
    },
    {
      key: 'textBox7',
      label: 'If not, where do patients go for imaging?',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor3',
      label: 'Imaging Comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
  ];

  operatingRoomJson = [
    {
      key: 'multi1',
      label: 'Monitors',
      controlType: 'multi',
      gridSize: 'p-col-4',
      options: [
        {key: 'bp', value: 'BP'},
        {key: 'hr', value: 'HR'},
        {key: 'sao2', value: 'SaO2'},
        {key: 'ekg', value: 'EKG'},
        {key: 'temp', value: 'Temp'},
      ]
    },
    {
      key: 'radio1',
      label: 'Anesthesia Machine',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio2',
      label: 'Oxygen',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor1',
      label: 'What surgical steel is available?',
      controlType: 'freeResponse',
      gridSize: 'p-col-6',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'What surgical steel is needed?',
      controlType: 'freeResponse',
      gridSize: 'p-col-6',
      height: '150'
    },
    {
      key: 'editor3',
      label: 'OR Logbook--what types of cases are performed?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'textBox1',
      label: 'What kind of anesthesia machines do you have? (for parts, etc)',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'radio3',
      label: 'Do you have vaporizers? (Anesthesia)?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'textBox2',
      label: 'If yes, what kind of vaporizers do you have?',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor4',
      label: 'Comments about ORs',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    }
  ];

  wardJson = [
    {
      key: 'radio1',
      label: 'EKG',
      controlType: 'radio',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio2',
      label: 'Defibrillator',
      controlType: 'radio',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio3',
      label: 'Oxygen',
      controlType: 'radio',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio4',
      label: 'Ambu bags',
      controlType: 'radio',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'multi1',
      label: 'Monitoring Capability',
      controlType: 'multi',
      gridSize: 'p-col-12',
      options: [
        {key: 'bp', value: 'BP'},
        {key: 'hr', value: 'HR'},
        {key: 'sao2', value: 'SaO2'},
        {key: 'ekg', value: 'EKG'},
        {key: 'temp', value: 'Temp'},
      ]
    },
    {
      key: 'radio5',
      label: 'Do the wards have 24 hour nursing care?',
      controlType: 'radio',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
  ];

  suppliesEquipmentJson = [
    {
      key: 'multi1',
      label: 'Is oxygen available at...',
      controlType: 'multi',
      gridSize: 'p-col-6',
      options: [
        {key: 'or', value: 'OR'},
        {key: 'wards', value: 'Wards'},
      ]
    },
    {
      key: 'radio1',
      label: 'Do you have portable O2 tanks available?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'textBox1',
      label: 'How many oxygen tanks are available/full at a time (for use in the OR)?',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox2',
      label: 'How many manometers do you have for oxygen tanks?',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor1',
      label: 'How do you get oxygen? (tanks delivered? compressors? other?) Comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'Where do you get IV fluids? Would we have access to that supply? Comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor3',
      label: 'Where do you get hospital supplies and medications?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio2',
      label: 'Autoclave on-site',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'textBox2',
      label: 'Size and number of autoclaves',
      controlType: 'textbox',
      gridSize: 'p-col-8',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor4',
      label: 'Autoclave comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor4',
      label: 'How do you get equipment repaired? Comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    }
  ];

  ambulanceJson = [
    {
      key: 'radio1',
      label: 'Does the hospital have a functional ambulance?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio2',
      label: 'Is your ambulance equipped with oxygen?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor1',
      label: 'Ambulance Comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-8',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'How do you typically transfer patients?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    }
  ];

  caseVolumeandStafJson = [
    {
      key: 'header1',
      label: 'Surgical Cases per week',
      controlType: 'header'
    },
    {
      key: 'textBox1',
      label: 'Adult',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox2',
      label: 'Peds  < 3y',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox3',
      label: 'Peds 3-5y',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox4',
      label: 'Peds >5y',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox5',
      label: 'Number of Surgeons',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox6',
      label: 'Number Full time',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox7',
      label: 'Number Part time',
      controlType: 'textbox',
      gridSize: 'p-col-4',
      keyFilter: 'noSpecial'
    },
    {
      key: 'multi1',
      label: 'What types of surgeons staff your hospital?',
      controlType: 'multi',
      gridSize: 'p-col-12',
      options: [
        {key: 'generalSurgeons', value: 'General Surgeons'},
        {key: 'orthopedicSurgeons', value: 'Orthopedic Surgeons'},
        {key: 'gynSurgeons', value: 'Gyn Surgeons'},
        {key: 'urologicSurgeon', value: 'Urologic Surgeons'},
        {key: 'temp', value: 'Temp'},
      ]
    },
    {
      key: 'radio1',
      label: 'Do your surgeons have blocked time in the OR?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor1',
      label: 'Comments on blocked time',
      controlType: 'freeResponse',
      gridSize: 'p-col-6',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'Typical Cases',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio2',
      label: 'Is there a need for urologic care?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio3',
      label: 'Can you perform urologic procedures?',
      controlType: 'radio',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor3',
      label: 'What urologic procedures can you perform?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor4',
      label: 'What types of surgical illness have the largest burden at this hospital?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor5',
      label: 'Of those procedures, what types of procedures are you unable to perform? (how can groups help?)',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'textBox8',
      label: 'Number of Anesthesiologists',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox9',
      label: 'Number of Anesthetists',
      controlType: 'textbox',
      gridSize: 'p-col-6',
      keyFilter: 'noSpecial'
    },
    {
      key: 'header2',
      label: 'Anesthesia cases/wk',
      controlType: 'header'
    },
    {
      key: 'textBox10',
      label: 'General',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox11',
      label: 'Spinal',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox12',
      label: 'Regional',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'textBox13',
      label: 'MAC',
      controlType: 'textbox',
      gridSize: 'p-col-12',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor6',
      label: 'What are other nearby hospitals and how is your working relationship with them?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio4',
      label: 'Is your ED open 24/7?',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'textBox14',
      label: 'If not, what hours is it open?',
      controlType: 'textbox',
      gridSize: 'p-col-8',
      keyFilter: 'noSpecial'
    },
    {
      key: 'editor7',
      label: 'What types of surgical cases come in through the ED other than trauma?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'radio5',
      label: 'Do you have an OR dedicated for C-sections?',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'radio6',
      label: 'Do C-sections bump existing OR cases?',
      controlType: 'radio',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor8',
      label: 'Comments',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
  ];

  personnelJson = [
    {
      key: 'editor1',
      label: 'How would a team integrate into your hospital system? (Surgeons, anesthesia, nursing care)',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'Med student role?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    }
  ];

  educationQIJson = [
    {
      key: 'editor1',
      label: 'Current In-service training programs',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'Current quality improvement programs',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor3',
      label: 'What educational programs could we provide in order to be helpful to this hospital?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    }
  ];

  logisticsJson = [
    {
      key: 'radio1',
      label: 'Are patients expected to pay? (under our care)',
      controlType: 'radio',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor1',
      label: 'Hospital pre-op requirements for surgery? (x-ray, labs, etc)',
      controlType: 'freeResponse',
      gridSize: 'p-col-6',
      height: '150'
    },
    {
      key: 'radio2',
      label: 'Are patients expected to pay for these services?',
      controlType: 'radio',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ]
    },
    {
      key: 'editor2',
      label: 'Would your hospital doctors round on the patients on whom we operate? What would be the system for daily sign out?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor3',
      label: 'How will charting work? What is your preferred system? (' +
        'If we bring our own charts, will the hospital also have a chart for the patients?)',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor4',
      label: 'What is the system for sign out for patients still in hospital once a group leaves?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor5',
      label: 'Access to translators?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    }
  ];

  accommodationsJson = [
    {
      key: 'editor1',
      label: 'Where would a group stay? Cost?',
      controlType: 'freeResponse',
      gridSize: 'p-col-6',
      height: '150'
    },
    {
      key: 'editor2',
      label: 'Transportation to hospital? (if off campus)?',
      controlType: 'freeResponse',
      gridSize: 'p-col-6',
      height: '150'
    },
    {
      key: 'editor3',
      label: 'Showers and bathrooms?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor4',
      label: 'What kinds of/how many bathrooms are available during the daytime/workday?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor5',
      label: 'How would groups store their supplies and equipment at the hospital? ' +
        '(Dedicated area for supplies vs integration into current hospital supplies?) ' +
        '(Note: question for the purpose of making sure that groups do not consume any of the current hospital resources.)',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor6',
      label: 'Accommodations for those on night call?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor7',
      label: 'Transportation from the airport? Cost?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },
    {
      key: 'editor8',
      label: 'Is there a system for providing meals? Cost?',
      controlType: 'freeResponse',
      gridSize: 'p-col-12',
      height: '150'
    },

  ];

  testInput = [
    {
      name: 'Hospital',
      json: '{"textBox1":{"question":"Hospital Name","value":"Emory"},"textBox2":{"question":"Name of Host","value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,043"},"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms","value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},"radio1":{"question":"PCAU?","value":"Yes"},"radio2":{"question":"Pre-op?","value":"No"}}'
    },
  ];


}
