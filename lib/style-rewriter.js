var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')
var cache = require('lru-cache')(100)
var assign = require('object-assign')

var deasync = require('deasync')

var currentId
var addId = postcss.plugin('add-id', function () {
  return function (root) {
    root.each(function rewriteSelector (node) {
      if (!node.selector) {
        // handle media queries
        if (node.type === 'atrule' && node.name === 'media') {
          node.each(rewriteSelector)
        }
        return
      }
      node.selector = selectorParser(function (selectors) {
        selectors.each(function (selector) {
          var node = null
          selector.each(function (n) {
            if (n.type !== 'pseudo') node = n
          })
          selector.insertAfter(node, selectorParser.attribute({
            attribute: currentId
          }))
        })
      }).process(node.selector).result
    })
  }
})

/**
 * Add attribute selector to css
 *
 * @param {String} id
 * @param {String} css
 * @param {Boolean} scoped
 * @param {Object} options
 * @return {Promise}
 */

module.exports = deasync(function (id, css, scoped, options, cbk) {
  var key = id + '!!' + scoped + '!!' + css
  var val = cache.get(key)
  if (val) {
    cbk(null, val)
  } else {
    var plugins = []
    var opts = {}

    // // do not support post plugins here, use fis3 style plugins
    // if (options.postcss instanceof Array) {
    //   plugins = options.postcss.slice()
    // } else if (options.postcss instanceof Object) {
    //   plugins = options.postcss.plugins || []
    //   opts = options.postcss.options
    // }

    // scoped css rewrite
    // make sure the addId plugin is only pushed once
    if (scoped && plugins.indexOf(addId) === -1) {
      plugins.push(addId)
    }

    // remove the addId plugin if the style block is not scoped
    if (!scoped && plugins.indexOf(addId) !== -1) {
      plugins.splice(plugins.indexOf(addId), 1)
    }

    // // do not support cssnano minification here, use fis3 style plugins
    // // minification
    // if (process.env.NODE_ENV === 'production') {
    //   plugins.push(require('cssnano')(assign({
    //     safe: true
    //   }, options.cssnano)))
    // }
    currentId = id

    postcss(plugins)
      .process(css, opts)
      .then(function (res) {
        cache.set(key, res.css)
        cbk(null, res.css)
      })
  }
})

