/* global Backbone: true */
'use strict';
(function() {
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this.toggleLike = this.toggleLike.bind(this);
    },
    toggleLike: function() {
      var likes = this.get('likes');
      var liked = this.get('liked');
      this.set({'liked': !liked, 'likes': liked ? likes - 1 : likes + 1});
    }
  });
  window.PhotoModel = PhotoModel;
})();
