Template.postItem.helpers({ ownPost: function() {
return this.userId === Meteor.userId(); },
domain: function() {
var a = document.createElement('a'); a.href = this.url;
return a.hostname;
},
attributes: function() {
var post = _.extend({}, Positions.findOne({postId: this._id}), this); var newPosition = post._rank * POST_HEIGHT;
var attributes = {};
if (_.isUndefined(post.position)) { attributes.class = 'post invisible';
} else {
var delta = post.position - newPosition; attributes.style = "top: " + delta + "px"; if (delta === 0)
attributes.class = "post animate" }
Meteor.setTimeout(function() {
Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
});
return attributes; }
,
commentsCount: function() {
return Comments.find({postId: this._id}).count(); },
upvotedClass: function() {
var userId = Meteor.userId();
if (userId && !_.include(this.upvoters, userId)) {
return 'btn-primary upvotable'; } else {
return 'disabled'; }
} });
Template.postItem.events({
'click .upvotable': function(e) {
    e.preventDefault();
Meteor.call('upvote', this._id); }

});
Template.postItem.events({ 'click .upvote': function(e) {
    e.preventDefault();
Meteor.call('upvote', this._id); }
});
