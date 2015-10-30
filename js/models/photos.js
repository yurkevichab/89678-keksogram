/* global Backbone: true*/
'use strict';
define([
  'models/photo'
], function(PhotoModel) {
  return Backbone.Collection.extend({
    model: PhotoModel,
    url: 'data/pictures.json'
  });
});
