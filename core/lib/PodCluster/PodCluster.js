'use strict';

function PodCluster(options) {
  var _this = this;
  options = options || {};

  _this._cluster = [];
  _this._rootPodName = options.rootPodName;

};

PodCluster.prototype.registerPod = function (pod) {
  var _this = this;
  if (!pod.name) {
    throw new Error('Pod must have a name');
  }
  _this._cluster.push(pod);
  if (pod.isRoot) {
    _this._rootPodName = pod.name
  }
};

PodCluster.prototype.getPod = function (podName) {
  var pod = null;
  this._cluster.forEach(function (p) {
    if (podName === p.name) {
      pod = p;
    }
  });
  return pod;
};

PodCluster.prototype.getPodByBase = function (base, stripSlashes) {
  var podBase = ''
  var pod = null;
  this._cluster.forEach(function (p) {
    podBase = p.base;
    if (stripSlashes) podBase = podBase.replace('/', '');

    if (base === podBase) {
      pod = p;
    }
  });
  return pod;
};

PodCluster.prototype.getCluster = function () {
  return this._cluster;
};

module.exports = PodCluster;
