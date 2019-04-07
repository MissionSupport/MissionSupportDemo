/**
 * This interface represents what the document will look like when a user edits a task.
 */
export interface EditTask {
  date: Date;
  email: string;
  id: string;
  markup: string;
  new_title: string;
  title: string;
  user_id: string;
  owner_id: string;
  type: string;
}
