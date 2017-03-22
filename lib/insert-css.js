var uglifyJS = require('uglify-js');

function insertCSS(styleContent) {
  var styleNode = document.createElement("style");
  styleNode.setAttribute("type", "text/css");
  if (styleNode.styleSheet) {
    styleNode.styleSheet.cssText = styleContent;
  } else {
    styleNode.appendChild(document.createTextNode(styleContent));
  }
  document.getElementsByTagName("head")[0].appendChild(styleNode);
};

module.exports = uglifyJS.minify(insertCSS.toString(), {fromString: true}).code;
