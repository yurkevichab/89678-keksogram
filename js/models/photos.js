/* global Backbone: true*/
'use strict';
define([
  'models/photo'
], function(PhotoModel) {
  var PhotosCollection = Backbone.Collection.extend({
    model: PhotoModel,
    url: 'data/pictures.json'
  });
  return PhotosCollection;
});
