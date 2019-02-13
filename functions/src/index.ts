const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Used after a user first creates an account
exports.createUserPreferences = functions.auth.user().onCreate(user => {
  const userId = user.uid;
  console.log(user);
  console.log('Creating user_preferences for', userId);
  return admin.firestore().collection('user_preferences').doc(userId).set({
    admin: false,
    id: userId,
    orgs: [],
    teams: []
  });
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
