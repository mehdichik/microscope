// Fixture data 
if (Posts.find().count() === 0) {
  var now = new Date().getTime();

  // create two users

  var mehdiId = Accounts.createUser({
    profile: {
      name: 'Mehdi Ibn Cheikh'
    },
    username: "mehdichik",
    email: "mehdichik@gmail.com",
    password: "mallouka",
    gender:"m",
    country:"tn",
  });

  var tomId = Accounts.createUser({
    profile: {
      name: 'Tom Coleman'
    },
    username: "tom",
    email: "tom@example.com",
    password: "123456",
    gender:"m",
    country:"tn",
  });
  var mehdi = Meteor.users.findOne(mehdiId);
  var tom = Meteor.users.findOne(tomId);
  
  var telescopeId = Posts.insert({
    title: 'Introducing Telescope',
    userId: mehdi._id,
    author: mehdi.profile.name,
    url: 'http://sachagreif.com/introducing-telescope/',
    submitted: new Date(now - 7 * 3600 * 1000),
    commentsCount: 2,
    upvoters: [], votes: 0
  });
  
  Comments.insert({
    postId: telescopeId,
    userId: tom._id,
    author: tom.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Interesting project Sacha, can I get involved?'
  });
  
  Comments.insert({
    postId: telescopeId,
    userId: mehdi._id,
    author: mehdi.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'You sure can Tom!'
  });
  
  Posts.insert({
    title: 'Meteor',
    userId: tom._id,
    author: tom.profile.name,
    url: 'http://meteor.com',
    submitted: new Date(now - 10 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  Posts.insert({
    title: 'The Meteor Book',
    userId: tom._id,
    author: tom.profile.name,
    url: 'http://themeteorbook.com',
    submitted: new Date(now - 12 * 3600 * 1000),
    commentsCount: 0,
    upvoters: [], votes: 0
  });
  
  for (var i = 0; i < 10; i++) {
    Posts.insert({
      title: 'Test post #' + i,
      author: mehdi.profile.name,
      userId: mehdi._id,
      url: 'http://google.com/?q=test-' + i,
      submitted: new Date(now - i * 3600 * 1000 + 1),
      commentsCount: 0,
      upvoters: [], votes: 0
    });
  }
}