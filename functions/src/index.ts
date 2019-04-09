const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Used after a user first creates an account
exports.createUserPreferences = functions.auth.user().onCreate(user => {
  const userId = user.uid;
  console.log(user);
  console.log('Creating user_preferences for', userId);
  // Let's see if they will be verified or not.
  const verified = user.email.toLocaleLowerCase().includes('.edu', user.email.length - 4);
  const batch = admin.firestore().batch();
  const pref = admin.firestore().doc(`user_preferences/${userId}`)
  batch.create(pref, {
    admin: false,
    id: userId,
    orgs: [],
    teams: [],
    verified: verified,
    email: user.email
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

  // Attach to team first
  admin.firestore().doc(`teams/${teamId}`).get().then(data => {
    const array = data.data().trips;
    array.push(tripId);
    admin.firestore().doc(`teams/${teamId}`).update({'trips': array});
  });

  // Attach to site now
  admin.firestore().doc(`sites/${siteId}`).get().then(data => {
    const array = data.data().tripIds;
    array.push(tripId);
    admin.firestore().doc(`sites/${siteId}`).update({'tripIds': array});
  });
});

// Used after creating a team then adding the reference to the user
exports.createTeam = functions.firestore.document('teams/{teamId}').onCreate((snap, context) => {
  const newData = snap.data();
  const email = newData.admins[0];
  return admin.auth().getUserByEmail(email).then(user => {
    const userId = user.uid;
    return admin.firestore().doc(`user_preferences/${userId}`).set({'teams': [context.params.teamId]}, {merge: true});
  });
});

// Used for when a new team member is added
exports.updateTeam = functions.firestore.document(`teams/{teamId}`).onUpdate((change, context) => {
  const teamId = context.params.teamId;
  const oldData = change.before.data();
  const newData = change.after.data();
  if (oldData.admins.length < newData.admins.length) { // a new user was added
    const array = newData.admins.filter(t => !oldData.admins.includes(t));
    for (const email of array) {
      admin.auth().getUserByEmail(email).then(user => {
        admin.firestore().doc(`user_preferences/${user.uid}`).set({teams: teamId}, {merge: true})
      });
    }
  } else if (oldData.admins.length > newData.admins.length) { // a user was removed
    const array = oldData.admins.filter(t => !newData.admins.includes(t));
    for (const email of array) {
      admin.auth().getUserByEmail(email).then(user => {
        admin.firestore().doc(`user_preferences/${user.uid}`).get().then(data => {
          const newArray = data.data().teams.filter(f => f !== teamId);
          admin.firestore().doc(`user_preferences/${user.uid}`).update({'teams': newArray});
        });
      });
    }
  }
});

// Used for when a new org member is added
exports.updateOrganization = functions.firestore.document('organizations/{orgId}').onCreate((change, context) => {
  const orgId = context.params.orgId;
  const oldData = change.before.data();
  const newData = change.after.data();
  if (oldData.admins.length < newData.admins.length) { // a new user was added
    const array = newData.admins.filter(t => !oldData.admins.includes(t));
    for (const email of array) {
      admin.auth().getUserByEmail(email).then(user => {
        admin.firestore().doc(`user_preferences/${user.uid}`).set({orgs: orgId}, {merge: true})
      });
    }
  } else if (oldData.admins.length > newData.admins.length) { // a user was removed
    const array = oldData.admins.filter(t => !newData.admins.includes(t));
    for (const email of array) {
      admin.auth().getUserByEmail(email).then(user => {
        admin.firestore().doc(`user_preferences/${user.uid}`).get().then(data => {
          const newArray = data.data().orgs.filter(f => f !== orgId);
          admin.firestore().doc(`user_preferences/${user.uid}`).update({'orgs': newArray});
        });
      });
    }
  }
});

