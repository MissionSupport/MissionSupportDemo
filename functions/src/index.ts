const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Used after a user first creates an account
exports.createUserPreferences = functions.auth.user().onCreate(user => {
  const userId = user.uid;
  console.log(user);
  console.log('Creating user_preferences for', userId);
  const batch = admin.firestore().batch();
  const pref = admin.firestore().doc(`user_preferences/${userId}`)
  batch.create(pref, {
    admin: false,
    id: userId,
    orgs: [],
    teams: []
  });
  console.log('Create email mapping to uid for user');
  const email = admin.firestore().doc(`emails/${user.email}`);
  batch.create(email, {id: userId});
  return batch.commit().then(() => {
    console.log('Success!');
  })
});

// Used after creating an org adding the reference to the user
exports.createOrganization = functions.firestore.document('organizations/{orgId}').onCreate((snap, context) => {
  const newData = snap.data();
  const userId = newData.admins[0];
  admin.firestore().doc(`user_preferences/${userId}`).get().then( data => {
    console.log(data.data());
    const array = data.data().orgs;
    array.push(context.params.orgId);
    admin.firestore().doc(`user_preferences/${userId}`).update({'orgs': array});
  });
});

// on trip creation attach it to the team and the site
exports.updateTeamAndSite = functions.firestore.document('trips/{tripId}').onCreate((snapshot, context) => {
  const newData = snapshot.data();
  const tripId = newData.id;
  const teamId = newData.teamId;
  const siteId = newData.siteId;
  const countryId = newData.countryId;

  // Attach to team first
  admin.firestore().doc(`teams/${teamId}`).get().then(data => {
    const array = data.data().trips;
    array.push(tripId);
    admin.firestore().doc(`teams/${teamId}`).update({'trips': array});
  });

  // Attach to site now
  admin.firestore().doc(`countries/${countryId}/sites/${siteId}`).get().then(data => {
    const array = data.data().tripIds;
    array.push(tripId);
    admin.firestore().doc(`countries/${countryId}/sites/${siteId}`).update({'tripIds': array});
  })
});
