/**
 * This class represents what user preferences look like for a user.
 */
export interface UserPreferences {
  admin: false;
  email: string;
  id: string;
  orgs: string[];
  teams: string[];
  verified: boolean; // Handle whether a user is verified or not
}
