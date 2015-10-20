/* global Backbone: true */
'use strict';
(function() {
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this._onLike = this._onLike.bind(this);
    },
    like: function() {
      this.set('liked', true);
    },
    dislike: function() {
      this.set('liked', false);
    },
    _onLike: function() {
      if (!this.get('liked')) {
        this.set('likes', this.get('likes') + 1);
        this.like();
      } else {
        this.set('likes', this.get('likes') - 1);
        this.dislike();
      }
    }
  });

  window.PhotoModel = PhotoModel;

})();
