const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


exports.createUserPreferences = functions.firestore.document('/users/{userId}').onCreate((create, context) => {
  const user = context.params.userId;
  console.log('Creating user_preferences for', user);
  return admin.firestore().collection('user_preferences').doc(user).set({
    id: user,
    admin: false,
    sites: [],
  });
});
