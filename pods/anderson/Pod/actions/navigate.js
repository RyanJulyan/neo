/**
 * Created by Gloo on 2015-02-25.
 */
module.exports = function (actionContext, payload, done) {
  actionContext.dispatch('CHANGE_ROUTE', payload);
  done();
};
