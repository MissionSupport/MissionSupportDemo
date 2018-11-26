/**
 * This interface represents what the document will look like when a user edits a task.
 */
export interface EditTask {

  user: string; // the uid of the user who is creating an EditTask, will be the same as document id.
  markdown: string; // The markdown for the edits they want to create.
  submitted: boolean; // Set to true if you want the editors of the site to look and approve this.
}
