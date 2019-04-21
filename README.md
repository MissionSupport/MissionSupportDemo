# Mission Support

Mission Support is a crowd-sourced, wiki-style web application for medical mission trips to share information about various disaster areas, the inventory available at each location, and general tips for other mission groups. Currently, there is no central location for information about the situation on the ground at different sites, which creates confusion and additional costs for missions. Our project is a crowdsourced platform to allow medical professionals to report information about where they are serving, so future missions will be better prepared.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.4.

## Release Notes
*v1.0.0 - April 22, 2019*

Original Release of Mission Support, comes with the following features:
* Email Authentication (through Google Firebase, uses email verification)
* User Profiles and Permissions (Hierarchy of Anon < User < Certified < Admin)
  * Read Access from User+, Write Access from Certified+, Global User settings from Admin
  * Password Formatting Standards (7 characters+, requires Uppercase, Lowercase, and Number/Special Character)
  * Admin Dashboard to verify/certify users, verify non-certified user-requested changes, organize users
* Organizations and Teams creatable by users, with custom wiki pages editable by organization/team members
* Country/Site wiki-style pages with customizable categories/sub-categories, write access limited to verified users
  * Predefined categories and initial text for all Wiki pages and Checklists
  * Permission Editing System: Non-certified users may submit edits to pages, to be verified by admins
* Dynamic and Customizable Forms/Checklist module to create various styles of forms and checklists
  * PIPES checklist pre-imported through default checklist options
* Site Searching through Text Search, Map Search, or browsing by Country
* Toolbar/Side Profile accessible on any page (excluding Login/Registration)
* Offline viewing/caching through local Firebase

### Known Bugs / Defects
* Delete code is half done.
* Cannot join team after team creation.
* Cannot join organization.
* No invites for Organization.
* No invites for team after creation.
* Admin Dashboard page can take long time to load.


## Install Guide

Installation is only required for the host who plans to run the server that Mission Support will run on. Any typical user may simply visit the currently deployed version of Mission Support via [this link](https://missionsupport1-1541644479691.firebaseapp.com/login).

---

For the server host, clone this repository by downloading as a .zip file or cloning with HTTPS with the link: `https://github.com/MissionSupport/MissionSupportDemo.git`. Once the repository is on your machine, use a Command Propmpt/Terminal and navigate to the directory that this project is contained in. The last folder in your file path should be `...\MissionSupportDemo`. Then, follow the instructions below:

* First, [Node.js](https://nodejs.org/en/) must be installed on your machine. Please go to the [Node.js website](https://nodejs.org/en/) and download and install Node.js for your operating system. You may check if Node.js has been correctly installed by opening a new instance of Command Prompt/Terminal and typing in `node -v`, which should return the current version of Node.js on your machine (or an error if Node.js has not been found)
* Second, ensure that [npm](https://docs.npmjs.com/) has been installed by opening a new instance of Command Prompt/Terminal and typing in `npm -v`, which should return the current version of npm on your machine. npm is a package manager that will allow you to install the [Angular CLI](https://cli.angular.io/)
* Third, install the [Angular CLI](https://cli.angular.io/) by typing in your Command Prompt/Terminal: `npm install -g @angular/cli`. This will install `@angular/cli` as a global environment on your machine.
* Finally, run `npm install` to install all dependencies required to run Mission Support.
* To test Mission Support or create any changes, run `ng serve` in your Command Prompt for a development server. Navigate to `http://localhost:4200/` to see a live version of the application, that will reload if any source files are changed.
* To deploy Mission Support to the server, run `ng build --prod` to create the project build, and deploy to Firebase using `firebase deploy`.
* If you wish to add any of your own files or features, please look into [Angular](https://angular.io/). You can generate new components with `ng generate component component-name`, or other files with `ng generate directive|pipe|service|class|guard|interface|enum|module`

### Troubleshooting

If you run into any issues building or running the development server, please run `npm install` to make sure that all your dependencies are updated with Mission Support requirements.  

## Further help (Angular CLI)

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
