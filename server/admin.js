var mehdi = Meteor.users.findOne({username: 'mehdichik'});
Roles.addUserToRoles( mehdi._id ,  ["admin"] );

var nameIcantSpel = Meteor.users.findOne({username: 'tom'});
Roles.removeUserFromRoles( nameIcantSpel._id, ["admin"] );