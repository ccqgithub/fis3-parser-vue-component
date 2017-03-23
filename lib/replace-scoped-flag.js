module.exports = function(str, cssScopedFlag, vuecId) {
  var reg = new RegExp('([^a-zA-Z0-9\-_])('+ cssScopedFlag +')([^a-zA-Z0-9\-_])', 'g');
  str = str.replace(reg, function($0, $1, $2, $3) {
    return $1 + vuecId + $3;
  });
  return str;
}
