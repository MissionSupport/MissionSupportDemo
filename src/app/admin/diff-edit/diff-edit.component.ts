import {Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { diff_match_patch } from 'diff-match-patch';
import {FormGroup} from '@angular/forms';
import {EditTask} from '../../interfaces/edit-task';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {Country} from '../../interfaces/country';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-diff-edit',
  templateUrl: './diff-edit.component.html',
  styleUrls: ['./diff-edit.component.css'],
  styles: [
    // ':host >>> .ui-listbox-item {background-color: getColor() !important;}'
  ]
})
export class DiffEditComponent implements OnInit {
  @Input() original;
  @Input() new;
  @Input() layoutNum;
  @Input() edit: EditTask;
  @Output() updatedVersion = new EventEmitter();

  // @ViewChild('listElement')
  // private listElTpl: ElementRef<any>;
  unicodeRangeStart = 0xE000;
  tagMap: any;
  mapLength: number;
  dmp: diff_match_patch;
  left;
  right;
  diffOutput;
  editor;
  diffrences: {type, string}[] = [];
  selectedEdits;
  layout;

  constructor(private readonly db: AngularFirestore, private authInstance: AngularFireAuth) {
    // $scope.$watch('left',() => { this.doDiff(); });
    // $scope.$watch('right',() => { this.doDiff(); });

  }

  ngOnInit(): void {
    // console.log(this.listElTpl);
    // const childNode = this.listElTpl.elementRef.nativeElement;
    // console.log(childNode);
    this.left = this.original;
    this.right = this.new;
    this.layout = this.layoutNum;
    this.tagMap = {};
    this.mapLength = 0;

    // Go ahead and map nbsp;
    const unicodeCharacter = String.fromCharCode(this.unicodeRangeStart + this.mapLength);
    this.tagMap['&nbsp;'] = unicodeCharacter;
    this.tagMap[unicodeCharacter] = '&nbsp;';
    this.mapLength++;

    this.dmp = new diff_match_patch();
    this.doDiff();
    // console.log(this.diffrences);
  }

  doDiff(): void {
    const diffableLeft = this.convertHtmlToDiffableString(this.left);
    const diffableRight = this.convertHtmlToDiffableString(this.right);
    const diffs = this.dmp.diff_main(diffableLeft, diffableRight);
    this.dmp.diff_cleanupSemantic(diffs);
    let diffOutput = '';
    for (let x = 0; x < diffs.length; x++) {
      diffs[x][1] = this.insertTagsForOperation(diffs[x][1], diffs[x][0]);
      diffOutput += this.convertDiffableBackToHtml(diffs[x][1]);
    }

    // this.$scope.diffOutput = this.$sce.trustAsHtml(diffOutput);
    this.diffOutput = diffOutput;
    // console.log(this.diffOutput);
  }

  insertTagsForOperation(diffableString: string, operation: number): string {

    // Don't insert anything if these are all tags
    const orgString = diffableString;
    let n = -1;
    do {
      n++;
    }
    while (diffableString.charCodeAt(n) >= this.unicodeRangeStart + 1);
    if (n >= diffableString.length) {
      return diffableString;
    }

    let openTag = '';
    let closeTag = '';
    if (operation === 1) {
      openTag = '<u style="background-color: rgb(204, 232, 204);">';
      closeTag = '</u>';
    } else if (operation === -1) {
      openTag = '<s style="background-color: rgb(250, 204, 204);">';
      closeTag = '</s>';
    } else {
      return diffableString;
    }

    let outputString = openTag;
    let isOpen = true;
    for (let x = 0; x < diffableString.length; x++) {
      if (diffableString.charCodeAt(x) < this.unicodeRangeStart) {
        // We just hit a regular character. If tag is not open, open it.
        if (!isOpen) {
          outputString += openTag;
          isOpen = true;
        }

        // Always add regular characters to the output
        outputString += diffableString[x];
      } else {
        // We just hit one of our mapped unicode characters. Close our tag.
        if (isOpen) {
          outputString += closeTag;
          isOpen = false;
        }

        // If this is a delete operation, do not add the deleted tags
        // to the output
        if (operation === -1) {
          continue;
        } else {
          outputString += diffableString[x];
        }
      }
    }

    if (isOpen) { outputString += closeTag; }
    this.diffrences = [...this.diffrences, {type: operation, string: orgString}];
    return outputString;
  }

  convertHtmlToDiffableString(htmlString: string): string {
    htmlString = htmlString.replace(/&nbsp;/g, this.tagMap['&nbsp;']);
    let diffableString = '';

    let offset = 0;
    while (offset < htmlString.length) {
      const tagStart = htmlString.indexOf('<', offset);
      if (tagStart < 0) {
        diffableString += htmlString.substr(offset);
        break;
      } else {
        const tagEnd = htmlString.indexOf('>', tagStart);
        if (tagEnd < 0) {
          // Invalid HTML
          // Truncate at the start of the tag
          console.log('Invalid HTML. String will be truncated.');
          diffableString += htmlString.substr(offset, tagStart - offset);
          break;
        }

        const tagString = htmlString.substr(tagStart, tagEnd + 1 - tagStart);

        // Is this tag already mapped?
        let unicodeCharacter = this.tagMap[tagString];
        if (unicodeCharacter === undefined) {
          // Nope, need to map it
          unicodeCharacter = String.fromCharCode(this.unicodeRangeStart + this.mapLength);
          this.tagMap[tagString] = unicodeCharacter;
          this.tagMap[unicodeCharacter] = tagString;
          this.mapLength++;
        }

        // At this point it has been mapped, so now we can use it
        diffableString += htmlString.substr(offset, tagStart - offset);
        diffableString += unicodeCharacter;

        offset = tagEnd + 1;
      }
    }
    return diffableString;
  }

  convertDiffableBackToHtml(diffableString: string): string {
    let htmlString = '';

    for (let x = 0; x < diffableString.length; x++) {
      const charCode = diffableString.charCodeAt(x);
      if (charCode < this.unicodeRangeStart) {
        htmlString += diffableString[x];
        continue;
      }

      const tagString = this.tagMap[diffableString[x]];
      if (tagString === undefined) {
        // We somehow have a character that is above our range but didn't map
        // Do we need to add an upper bound or change the range?
        htmlString += diffableString[x];
      } else {
        htmlString += tagString;
      }
    }
    return htmlString;
  }

  submitRevision() {
    console.log(this.diffOutput);
    this.updatedVersion.emit(this.diffOutput);
    // Delete edit
    const edit = this.edit;
    const wikiId = this.db.createId();
    this.db.doc(`countries/${edit.country_id}`).valueChanges().pipe(map((country: Country) => {
      return this.db.doc(`wiki/${country.current}`).valueChanges().pipe(take(1)).toPromise();
    }), take(1)).toPromise().then(wiki => {
      if (edit.new_title) {
        wiki[edit.new_title] = this.diffOutput;
        wiki[edit.title] = firebase.firestore.FieldValue.delete();
      } else {
        wiki[edit.title] = this.diffOutput;
      }
      this.db.firestore.batch()
        .delete(this.db.doc(`edits/${edit.id}`).ref)
        // Now lets update the ref in the organization and create a new version
        .set(this.db.doc(`wiki/${wikiId}`).ref, wiki)
        .update(this.db.doc(`countries/${edit.country_id}`).ref, {current: wikiId})
        .commit().then(d => {
          // Now create history doc
        const data = {
          created_id: this.authInstance.auth.currentUser.uid,
          date: new Date()
        };
        this.db.doc(`wiki/${wikiId}/data/data`).set(data);
      }).catch(d => {
        console.log(d);
      });
    });
  }

  doEdits() {
    console.log(this.selectedEdits);
    this.selectedEdits.forEach( edit => {
      if (edit.type === 1) {
        this.diffOutput = this.diffOutput.replace('<u style="background-color: rgb(204, 232, 204);">' + edit.string + '</u>', edit.string);
      } else {
        // console.log(this.diffOutput, edit);
        this.diffOutput = this.diffOutput.replace('<s style="background-color: rgb(250, 204, 204);">' + edit.string + '</s>', '');
      }
    });
  }

}
