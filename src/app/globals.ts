// globals.ts
import {Injectable} from '@angular/core';
import { Question, Validator } from './checklist/question';
import { Validators } from '@angular/forms';

const requiredValidator: Validator = {
  name: 'required',
  validator: Validators.required,
  message: 'This field is required.'
};

const alphanumericValidator: Validator = {
  name: 'pattern',
  validator: Validators.pattern(/^[a-zA-Z0-9\s]+$/),
  message: 'This field must be alphanumeric.'
};

const numericValidator: Validator = {
  name: 'pattern',
  validator: Validators.pattern(/^[0-9]+$/),
  message: 'This field must be numeric.'
};

const emailValidator: Validator = {
  name: 'email',
  validator: Validators.email,
  message: 'This field must be an email address.'
};

@Injectable()
export class PreDefined {
  wikiCountry = [
    {
      title : 'Communication',
      markup : 'How much service is there for American carriers? What local carriers work well? What is the process to get cellular ' +
        'data, if it is available? How common is Internet access?'
    },
    {
      title: 'Customs',
      markup: 'What did you bring through customs? How did you get that medical equipment to your site? Was anything confiscated? ' +
        'Did you work with customs before departing to ensure your stuff will make it? If so, please detail that process.'
    },
    {
      title: 'Contacts',
      markup: 'Were there any local, government, or non-government organizations you found useful? If so, how did they help you? What ' +
        'was the relationship like? What is their contact info?'
    },
    {
      title: 'Transit',
      markup: 'How did you get from the airport, or port, to the site? Are the public transportation systems reliable? Can you drive ' +
        'yourself, or did you book transportation? What was your preferred method for traveling between cities?'
    },
    {
      title: 'Culture',
      markup: 'What cultural taboos should staff be aware of? Is there anything common in Western culture that would offend locals? ' +
        'Conversely, what cultural customs do they have which might offend staff? How did you deal with it?'
    },
    {
      title: 'Money',
      markup: 'Is the U.S. dollar preferred? If not, where did you exchange currency? Are cards accepted, ' +
      'or is it a primarily cash-based society? Did you take all your cash at once, or did you continuously ' +
      'withdraw smaller amounts? If so, where did you withdraw cash from?'
    },
    {
      title: 'Comfort and Availability',
      markup: 'What comforts and necessities did you miss while in this country? What was readily available? ' +
        'What should staff bring to stay comfortable during their trips?'
    },
    {
      title: 'Crimes and Scams',
      markup: 'What is the crime rate like? What scams will staff run across? Are foreigners more likely to be targeted?'
    },
    {
      title: 'Population Health',
      markup: 'What level of care does the population generally receive? Is any type of care noticeably lacking? ' +
        'What health issues seem to be common in this country?'
    }
  ];

  wikiSite = [
    {
      title: 'Pharmaceutical',
      markup: 'Is there a place to get drugs nearby? How accessible are the drugs? If you do not bring everything you need' +
        ' or run out, what is the process for getting more?'
    },
    {
      title: 'Assistance',
      markup: 'What level of assistance can you expect from local staff? What types of training will the staff have?'
    },
    {
      title: 'Conditions',
      markup: 'Is the water drinkable? Can it be used for medical purposes? Do they have constant electricity?' +
        ' If not, do they have backup generators?'
    },
    {
      title: 'Technology',
      markup: 'What level of technology do they have, and what is the condition of the technology? ' +
        'Do they have a dedicated maintenance team? Is there a lab or imaging, etc.? What are the hours? How is this technology managed?'
    },
    {
      title: 'Security',
      markup: 'How secure is the site? Is there on-staff security at all hours? Should staff avoid leaving alone?'
    },
    {
      title: 'Living and Transportation',
      markup: 'What accommodation is nearby? Should staff live near the site, ' +
        'or somewhere else? How should staff commute to the site: walk, transit, or cars?'
    },
    {
      title: 'Patient Traffic',
      markup: 'Give a breakdown of the types of operations performed on a day to day basis. ' +
        'What is this site equipped to handle? What do they struggle with?'
    }
  ];

  wikiTrip = [
    {
      title: 'Purpose',
      markup: 'What was the purpose of the trip? Was it successful?'
    },
    {
      title: 'Type of Care',
      markup: 'What type of care were you providing? Why did you choose to do that type? Is that type of care available,' +
        ' or were you providing access to normally unavailable services?'
    },
    {
      title: 'Preparation',
      markup: 'How many people did you bring? Did you follow the site checklist? Where did you stay?'
    },
    {
      title: 'Unique Challenges',
      markup: 'What unique challenges did you run into? Could future groups encounter the same issue? If so, how would you' +
        ' recommend future groups approach this problem?'
    },
    {
      title: 'Contact',
      markup: 'Please leave a contact person who can answer follow up questions about the trip.'
    }
  ];

  wikiOrg = [
    {
      title: 'About Us',
      markup: 'General information about the organization: size, location, funding, purpose, etc.'
    },
    {
      title: 'Types of Care Provided',
      markup: 'Do you specialize in specific services? If so, what?'
    },
    {
      title: 'Contact Info',
      markup: 'Contact information.'
    }
  ];

  hospitalChecklist: Question[] = [
    {
      key: 'textbox1',
      name: 'hospitalName',
      label: 'Hospital Name',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, alphanumericValidator]
    },
    {
      key: 'textbox2',
      name: 'hostName',
      label: 'Host Name',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, alphanumericValidator]
    },
    {
      key: 'textbox3',
      name: 'hostHospitalPosition',
      label: 'Host Position at Hospital',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, alphanumericValidator]
    },
    {
      key: 'textbox4',
      name: 'hostEmailAddress',
      label: 'Host Email Address',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, emailValidator]
    },
    {
      key: 'textbox5',
      name: 'hostPhoneNumber',
      label: 'Host Phone Number',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator]
    },
    {
      key: 'textbox6',
      name: 'totalNumberOfHospitalBeds',
      label: 'Total Number of Hospital Beds',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textbox7',
      name: 'numberOfMedSurgBeds',
      label: 'Number of Medical and Surgical Beds',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textbox8',
      name: 'numberOfOperatingRooms',
      label: 'Number of Operating Rooms',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textbox9',
      name: 'numberOfClinicRoomsAvailableForSurgery',
      label: 'Number of Clinic Rooms Available for Surgery',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'radio1',
      name: 'pcau',
      label: 'PCAU?',
      type: 'radioButton',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'preop',
      label: 'Pre-Op?',
      type: 'radioButton',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      gridSize: 'p-col-12 p-sm-6 p-md-6 p-lg-4',
      validators: [requiredValidator]
    }
  ];

  hospitalInfrastructureChecklist: Question[] = [
    {
      key: 'radio1',
      name: 'electricitySource',
      label: 'What is your primary source of electricity?',
      type: 'radioButton',
      options: [
        {key: 'City Grid', value: 'City Grid'},
        {key: 'Generator', value: 'Generator'}
      ],
      gridSize: 'p-col-4',
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'powerOutletsLocatedOnWards',
      label: 'Are power outlets located on wards?',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor1',
      name: 'backupPowerSupply',
      label: 'What is your backup power supply in case of a power outage?',
      type: 'freeResponse',
      value: '',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'radio3',
      name: 'generatorAvailable',
      label: 'Do you have a generator available 24/7?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'textBox1',
      name: 'electricityComments',
      label: 'Comments about generator/electricity.',
      type: 'textbox',
      value: '',
      gridSize: 'p-col-6',
      validators: []
    },
    {
      key: 'radio4',
      name: 'runningWaterAvailability',
      label: 'Do you have running water available 24/7?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio5',
      name: 'scrubSinksAvailability',
      label: 'Do you have scrub sinks?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor2',
      name: 'waterComments',
      label: 'Comments about access to water/sinks.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'radio6',
      name: 'pharmacyOnsite',
      label: 'Is there a pharmacy on site?',
      type: 'radioButton',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
  ];

  pharmacyLabChecklist: Question[] = [
    {
      key: 'textBox1',
      name: 'weekendPharmacyHours',
      label: 'Pharmacy Hours - Weekends',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: [requiredValidator]
    },
    {
      key: 'textBox2',
      name: 'weekdayPharmacyHours',
      label: 'Pharmacy Hours - Weekdays',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: [requiredValidator]
    },
    {
      key: 'medmultcheck1',
      name: 'antibiotics',
      label: 'Which antibiotics (PO/IV) do you keep in stock (available 100%)?',
      type: 'medicineMultipleCheckbox',
      gridSize: 'p-col-12 p-grid',
      validators: []
    },
    {
      key: 'medmultcheck2',
      name: 'analgesics',
      label: 'Which analgesics (PO/IV) do you keep in stock (available 100%)?',
      type: 'medicineMultipleCheckbox',
      gridSize: 'p-col-12 p-grid',
      validators: []
    },
    {
      key: 'medmultcheck3',
      name: 'generalAnesthetics',
      label: 'Which general anesthetics do you keep in stock (available 100%)?',
      type: 'medicineMultipleCheckbox',
      gridSize: 'p-col-12 p-grid',
      validators: []
    },
    {
      key: 'medmultcheck4',
      name: 'paralytics',
      label: 'Which paralytics do you keep in stock (available 100%)?',
      type: 'medicineMultipleCheckbox',
      gridSize: 'p-col-12 p-grid',
      validators: []
    },
    {
      key: 'medmultcheck5',
      name: 'antiHypertensives',
      label: 'Which hypertensives do you keep in stock (available 100%)?',
      type: 'medicineMultipleCheckbox',
      gridSize: 'p-col-12 p-grid',
      validators: []
    },
    {
      key: 'medmultcheck6',
      name: 'vasopressorsInotropes',
      label: 'Which vasopressors/inotropes do you keep in stock (available 100%)?',
      type: 'medicineMultipleCheckbox',
      gridSize: 'p-col-12 p-grid',
      validators: []
    },
    {
      key: 'medmulttextbox1',
      name: 'otherDrugs',
      label: 'Which other drugs do you keep in stock?',
      type: 'medicineMultipleTextbox',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'editor1',
      name: 'medicationSupplyComments',
      label: 'Comments on medication supply.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'radio6',
      name: 'labOnsite',
      label: 'Is there a lab on-site?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'multi1',
      name: 'labCapabilities',
      label: 'Lab Capabilities (select all that apply).',
      type: 'multipleSelect',
      gridSize: 'p-col-6',
      options: [
        {key: 'chem_7', value: 'Chem 7'},
        {key: 'chem_14', value: 'Chem 14 '},
        {key: 'cbc', value: 'CBC'},
        {key: 'abg', value: 'ABG'},
        {key: 'ua', value: 'UA'},
        {key: 'blood_urine_culture', value: 'Blood/Urine Culture'}
      ],
      validators: [] // TODO: cross-field validation with labOnsite (if yes)?
    },
    {
      key: 'textBox3',
      name: 'weekendLabHours',
      label: 'Lab Hours - Weekends',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: []  // TODO: cross-field validation with labOnsite (if yes)?
    },
    {
      key: 'textBox4',
      name: 'weekdayLabHours',
      label: 'Lab Hours - Weekdays',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: []  // TODO: cross-field validation with labOnsite (if yes)?
    },
    {
      key: 'editor2',
      name: 'noLabAvailable',
      label: 'If no lab is available, where do patients get lab work done?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []  // TODO: cross-field validation with labOnsite (if no)?
    },
    {
      key: 'radio7',
      name: 'bloodBankOnsite',
      label: 'Is there a blood bank available on-site?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'textBox5',
      name: 'noBloodAvailable',
      label: 'If no blood is available on-site, where is the blood bank?',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: []  // TODO: cross-field validation with bloodBankOnsite (if no)?
    },
    {
      key: 'textBox6',
      name: 'bloodProductsTime',
      label: 'How long does it take to obtain blood products?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'radio8',
      name: 'imagingOnsite',
      label: 'Is there imaging on-site?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'multi1',
      name: 'imagingCapabilities',
      label: 'Imaging Capabilities (select all that apply).',
      type: 'multipleSelect',
      gridSize: 'p-col-6',
      options: [
        {key: 'x_ray', value: 'X-ray'},
        {key: 'ultrasound', value: 'ultrasound'},
        {key: 'ct_scan', value: 'CT Scan'}
      ],
      validators: [] // TODO: cross-field validation with imagingOnsite (if yes)?
    },
    {
      key: 'textBox7',
      name: 'imagingNotAvailable',
      label: 'If not, where do patients go for imaging?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: []  // TODO: cross-field validation with imagingOnsite (if no)?
    },
    {
      key: 'editor3',
      name: 'imagingComments',
      label: 'Comments on imaging.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
  ];

  operatingRoomChecklist: Question[] = [
    {
      key: 'multi1',
      name: 'monitors',
      label: 'Monitors',
      type: 'multipleSelect',
      gridSize: 'p-col-4',
      options: [
        {key: 'bp', value: 'BP'},
        {key: 'hr', value: 'HR'},
        {key: 'sao2', value: 'SaO2'},
        {key: 'ekg', value: 'EKG'},
        {key: 'temp', value: 'Temp'},
      ],
      validators: []
    },
    {
      key: 'radio1',
      name: 'anesthesia',
      label: 'Anesthesia Machine',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'oxygen',
      label: 'Oxygen',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor1',
      name: 'surgicalSteelAvailable',
      label: 'What surgical steel is available?',
      type: 'freeResponse',
      gridSize: 'p-col-6',
      validators: []
    },
    {
      key: 'editor2',
      name: 'surgicalSteelNeeded',
      label: 'What surgical steel is needed?',
      type: 'freeResponse',
      gridSize: 'p-col-6',
      validators: []
    },
    {
      key: 'editor3',
      name: 'ORLogbook',
      label: 'OR Logbook--what types of cases are performed?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'textBox1',
      name: 'anesthesiaMachineTypes',
      label: 'What kind of anesthesia machines do you have? (for parts, etc)',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'radio3',
      name: 'anesthesiaVaporizers',
      label: 'Do you have vaporizers? (Anesthesia)',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'textBox2',
      name: 'vaporizerTypes',
      label: 'If yes, what kind of vaporizers do you have?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [] // TODO: cross-field validator with previous question.
    },
    {
      key: 'editor4',
      name: 'ORComments',
      label: 'Comments about ORs.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    }
  ];

  wardChecklist: Question[] = [
    {
      key: 'radio1',
      name: 'ekg',
      label: 'EKG?',
      type: 'radioButton',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'defibrillator',
      label: 'Defibrillator?',
      type: 'radioButton',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio3',
      name: 'oxygen',
      label: 'Oxygen?',
      type: 'radioButton',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio4',
      name: 'ambuBags',
      label: 'Ambu bags?',
      type: 'radioButton',
      gridSize: 'p-col-3',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'multi1',
      name: 'monitoringCapability',
      label: 'Monitoring Capability',
      type: 'multipleSelect',
      gridSize: 'p-col-12',
      options: [
        {key: 'bp', value: 'BP'},
        {key: 'hr', value: 'HR'},
        {key: 'sao2', value: 'SaO2'},
        {key: 'ekg', value: 'EKG'},
        {key: 'temp', value: 'Temp'},
      ],
      validators: []
    },
    {
      key: 'radio5',
      name: 'wardsNursingCare',
      label: 'Do the wards have 24-hour nursing care?',
      type: 'radioButton',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
  ];

  suppliesEquipmentChecklist: Question[] = [
    {
      key: 'multi1',
      name: 'oxygenAvailable',
      label: 'Is oxygen available at...?',
      type: 'multipleSelect',
      gridSize: 'p-col-6',
      options: [
        {key: 'or', value: 'OR'},
        {key: 'wards', value: 'Wards'},
      ],
      validators: []
    },
    {
      key: 'radio1',
      name: 'portableO2Tanks',
      label: 'Do you have portable O2 tanks available?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'textBox1',
      name: 'availableOxygenTanks',
      label: 'How many oxygen tanks are available/full at a time (for use in the OR)?',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: [numericValidator, requiredValidator]
    },
    {
      key: 'textBox2',
      name: 'manometersForOxygenTanks',
      label: 'How many manometers do you have for oxygen tanks?',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'editor1',
      name: 'oxygenSources',
      label: 'How do you get oxygen? (tanks delivered? compressors? other?) Comments.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor2',
      name: 'IVFluidSources',
      label: 'Where do you get IV fluids? Would we have access to that supply? Comments.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor3',
      name: 'hospitalSuppliesSources',
      label: 'Where do you get hospital supplies and medications?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'autoclaveAvailable',
      label: 'Is there an autoclave on-site?',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'textBox2',
      name: 'sizeNumberAutoclaves',
      label: 'Size and number of autoclaves.',
      type: 'textbox',
      gridSize: 'p-col-8',
      validators: [requiredValidator] // TODO: need to add cross-field validation for previous question.
    },
    {
      key: 'editor4',
      name: 'autoclaveComments',
      label: 'Comments on autoclaves.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'editor4',
      name: 'equipmentRepairedMethods',
      label: 'How do you get equipment repaired? Comments.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    }
  ];

  ambulanceChecklist: Question[] = [
    {
      key: 'radio1',
      name: 'functionalAmbulance',
      label: 'Does the hospital have a functional ambulance?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'ambulanceEquippedWithOxygen',
      label: 'Is your ambulance equipped with oxygen?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor1',
      name: 'ambulanceComments',
      label: 'Comments on ambulances.',
      type: 'freeResponse',
      gridSize: 'p-col-8',
      validators: []
    },
    {
      key: 'editor2',
      name: 'transferPatients',
      label: 'How do you typically transfer patients?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    }
  ];

  caseVolumeandStaffChecklist: Question[] = [
    {
      key: 'textBox1',
      name: 'adultSurgicalCases',
      label: 'Number of adult surgical cases per week',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox2',
      name: 'pediatricLessThan3SurgicalCases',
      label: 'Number of pediatric < 3 years surgical cases per week',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox3',
      name: 'pediatric3To5SurgicalCases',
      label: 'Number of pediatric 3 - 5 years surgical cases per week',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox4',
      name: 'pediatricGreaterThan5SurgicalCases',
      label: 'Number of pediatric > 5 years surgical cases per week',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox5',
      name: 'numberSurgeons',
      label: 'Number of Surgeons',
      type: 'textbox',
      gridSize: 'p-col-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox6',
      name: 'numberFullTime',
      label: 'Number full-time',
      type: 'textbox',
      gridSize: 'p-col-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox7',
      name: 'numberPartTime',
      label: 'Number part-time',
      type: 'textbox',
      gridSize: 'p-col-4',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'multi1',
      name: 'surgeonTypes',
      label: 'What types of surgeons staff your hospital?',
      type: 'multipleSelect',
      gridSize: 'p-col-12',
      options: [
        {key: 'generalSurgeons', value: 'General Surgeons'},
        {key: 'orthopedicSurgeons', value: 'Orthopedic Surgeons'},
        {key: 'gynSurgeons', value: 'Gyn Surgeons'},
        {key: 'urologicSurgeon', value: 'Urologic Surgeons'},
        {key: 'temp', value: 'Temp'},
      ],
      validators: []
    },
    {
      key: 'radio1',
      name: 'surgeonsBlockedTime',
      label: 'Do your surgeons have blocked time in the OR?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor1',
      name: 'blockedTimeComments',
      label: 'Comments on blocked time.',
      type: 'freeResponse',
      gridSize: 'p-col-6',
      validators: []
    },
    {
      key: 'editor2',
      name: 'typicalCases',
      label: 'Typical Cases',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'urologicCareNeed',
      label: 'Is there a need for urologic care?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio3',
      name: 'urologicCareCanBePerformed',
      label: 'Can you perform urologic procedures?',
      type: 'radioButton',
      gridSize: 'p-col-6',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor3',
      name: 'urologicProceduresThatCanBePerformed',
      label: 'What urologic procedures can you perform?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []  // TODO: cross-control validation with urologicCareCanBePerformed (if yes)?
    },
    {
      key: 'editor4',
      name: 'surgicalIllnessTypes',
      label: 'What types of surgical illness have the largest burden at this hospital?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor5',
      name: 'surgicalIllnessTypesUnableToPerform',
      label: 'Of those procedures, what types of procedures are you unable to perform? (how can groups help?)',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'textBox8',
      name: 'numberAnesthesiologists',
      label: 'Number of anesthesiologists',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox9',
      name: 'numberAnesthetists',
      label: 'Number of anesthetists',
      type: 'textbox',
      gridSize: 'p-col-6',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox10',
      name: 'numberGeneralAnesthesiaCases',
      label: 'How many general anesthesia cases do you have per week?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox11',
      name: 'numberSpinalAnesthesiaCases',
      label: 'How many spinal anesthesia cases do you have per week?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox12',
      name: 'numberRegionalAnesthesiaCases',
      label: 'How many regional anesthesia cases do you have per week?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'textBox13',
      name: 'numberMACAnesthesiaCases',
      label: 'How many MAC anesthesia cases do you have per week?',
      type: 'textbox',
      gridSize: 'p-col-12',
      validators: [requiredValidator, numericValidator]
    },
    {
      key: 'editor6',
      name: 'nearbyHospitals',
      label: 'What are other nearby hospitals and how is your working relationship with them?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'radio4',
      name: 'EDOpen',
      label: 'Is your ED open 24/7?',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'textBox14',
      name: 'EDHoursIfNot247',
      label: 'If not, what hours is it open?',
      type: 'textbox',
      gridSize: 'p-col-8',
      validators: [] // TODO: cross-control validation with EDOpen (if no)?
    },
    {
      key: 'editor7',
      name: 'surgicalCasesInEDNotTrauma',
      label: 'What types of surgical cases come in through the ED other than trauma?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'radio5',
      name: 'ORForCSections',
      label: 'Do you have an OR dedicated for C-sections?',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'radio6',
      name: 'CSectionsBumpExistingORCases',
      label: 'Do C-sections bump existing OR cases?',
      type: 'radioButton',
      gridSize: 'p-col-4',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor8',
      name: 'comments',
      label: 'Comments.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
  ];

  personnelChecklist: Question[] = [
    {
      key: 'editor1',
      name: 'teamIntegration',
      label: 'How would a team integrate into your hospital system? (surgeons, anesthesia, nursing care)',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor2',
      name: 'medStudentRole',
      label: 'Med student role?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    }
  ];

  educationQIChecklist: Question[] = [
    {
      key: 'editor1',
      name: 'trainingPrograms',
      label: 'Current in-service training programs.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor2',
      name: 'qualityImprovementPrograms',
      label: 'Current quality improvement programs.',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor3',
      name: 'educationalPrograms',
      label: 'What educational programs could we provide in order to be helpful to this hospital?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    }
  ];

  logisticsChecklist: Question[] = [
    {
      key: 'radio1',
      name: 'patientPay',
      label: 'Are patients expected to pay? (under our care)',
      type: 'radioButton',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor1',
      name: 'hospitalPreOpRequirements',
      label: 'Are there hospital pre-op requirements for surgery? (x-ray, labs, etc)',
      type: 'freeResponse',
      gridSize: 'p-col-6',
      validators: [requiredValidator]
    },
    {
      key: 'radio2',
      name: 'patientPayPreOp',
      label: 'Are patients expected to pay for these services?',
      type: 'radioButton',
      gridSize: 'p-col-12',
      options: [
        {key: '1', value: 'Yes'},
        {key: '0', value: 'No'}
      ],
      validators: [requiredValidator]
    },
    {
      key: 'editor2',
      name: 'doctorsRound',
      label: 'Would your hospital doctors round on the patients on whom we operate? What would be the system for daily sign out?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor3',
      name: 'charting',
      label: 'How will charting work? What is your preferred system? (' +
        'If we bring our own charts, will the hospital also have a chart for the patients?)',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor4',
      name: 'signoutSystem',
      label: 'What is the system for sign out for patients still in hospital once a group leaves?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor5',
      name: 'translators',
      label: 'Is there access to translators?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    }
  ];

  accommodationsChecklist: Question[] = [
    {
      key: 'editor1',
      name: 'groupStayCost',
      label: 'Where would a group stay? Cost?',
      type: 'freeResponse',
      gridSize: 'p-col-6',
      validators: [requiredValidator]
    },
    {
      key: 'editor2',
      name: 'transportation',
      label: 'Transportation to hospital? (if off-campus)?',
      type: 'freeResponse',
      gridSize: 'p-col-6',
      validators: []
    },
    {
      key: 'editor3',
      name: 'showersBathrooms',
      label: 'Showers and bathrooms?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'editor4',
      name: 'bathroomAvailability',
      label: 'What kinds of/how many bathrooms are available during the daytime/workday?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: []
    },
    {
      key: 'editor5',
      name: 'supplyStorage',
      label: 'How would groups store their supplies and equipment at the hospital? ' +
        '(Dedicated area for supplies vs integration into current hospital supplies?) ' +
        '(Note: question for the purpose of making sure that groups do not consume any of the current hospital resources.)',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor6',
      name: 'nightShiftAccommodations',
      label: 'Accommodations for those on night call?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor7',
      name: 'airportTransportation',
      label: 'Transportation from the airport? Cost?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },
    {
      key: 'editor8',
      name: 'mealsSystem',
      label: 'Is there a system for providing meals? Cost?',
      type: 'freeResponse',
      gridSize: 'p-col-12',
      validators: [requiredValidator]
    },

  ];

  testInput = [
    {
      name: 'Hospital',
      json: '{"textBox1":{"question":"Hospital Name","value":"Emory"},"textBox2":{"question":"Name of Host",' +
      '"value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
      '"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone' +
      'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,043"},' +
      '"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms",' +
      '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
      '"radio1":{"question":"PCAU?","value":"Yes"},"radio2":{"question":"Pre-op?","value":"No"}}'
    },
  ];
}
