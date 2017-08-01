var registerComponent = require('../core/component').registerComponent;
var utils = require('../utils/');

registerComponent('laser-controls', {
  schema: {
    cursor: {type: 'boolean', default: true},
    hand: {default: 'right'}
  },

  cursorEl: null,

  init: function () {
    var config = this.config;
    var data = this.data;
    var el = this.el;

    if (data.cursor) {
      el.sceneEl.addEventListener('renderstart', this.setupCursor.bind(this));
    }

    // Set all controller models.
    el.setAttribute('daydream-controls', {hand: data.hand});
    el.setAttribute('gearvr-controls', {hand: data.hand});
    el.setAttribute('oculus-touch-controls', {hand: data.hand});
    el.setAttribute('vive-controls', {hand: data.hand});

    // Wait for controller to connect before
    el.addEventListener('controllerconnected', function (evt) {
      var controllerConfig = config[evt.detail.name];

      if (!controllerConfig) { return; }

      if (this.cursorEl) {
        this.cursorEl.parentNode.removeChild(this.cursorEl);
      }

      el.setAttribute('raycaster', utils.extend({
        showLine: true
      }, controllerConfig.raycaster || {}));

      el.setAttribute('cursor', utils.extend({
        fuse: false
      }, controllerConfig.cursor));
    });
  },

  config: {
    'daydream-controls': {
      cursor: {downEvents: ['trackpaddown'], upEvents: ['trackpadup']}
    },

    'gearvr-controls': {
      cursor: {downEvents: ['trackpaddown'], upEvents: ['trackpadup']},
      raycaster: {origin: {x: 0, y: 0.0005, z: 0}}
    },

    'oculus-touch-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']},
      raycaster: {origin: {x: 0.001, y: 0, z: 0.065}, direction: {x: 0, y: -0.8, z: -1}}
    },

    'vive-controls': {
      cursor: {downEvents: ['triggerdown'], upEvents: ['triggerup']}
    }
  },

  setupCursor: function () {
    var el = this.el;
    var camera = el.sceneEl.camera;
    if (!camera) {
      return;
    }

    var cursorEl = document.createElement('a-cursor');
    for (var attribute of ['color', 'fuse', 'fuse-timeout', 'max-distance']) {
      var value = el.getAttribute(attribute);
      if (value) {
        cursorEl.setAttribute(attribute, value);
      }
    }

    camera.el.appendChild(cursorEl);
    this.cursorEl = cursorEl;
  }
});
