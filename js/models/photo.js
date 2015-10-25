/* global Backbone: true */
'use strict';
(function() {
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this.toggleLike = this.toggleLike.bind(this);
    },
    /**
     * Устанавливает значения количества лайков и флаг нажатия кнопки лайк на фото
     */
    toggleLike: function() {
      var likes = this.get('likes');
      var liked = this.get('liked');
      this.set({'liked': !liked, 'likes': liked ? likes - 1 : likes + 1});
    }
  });
  window.PhotoModel = PhotoModel;
})();
