
/*!
 * EJS
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html){
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
};

exports.html_tag_params = function(params, override) {
    var maybe_params = '';
    var undef ='';
    safe_merge(params, override);
    for (var key in params) {
        if (params[key] != undef) {
            maybe_params += ' ' + key + '="' + params[key].toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
        }
    }
    return maybe_params;
};
var safe_merge = exports.safe_merge = function(merge_what) {
    merge_what = merge_what || {};
    Array.prototype.slice.call(arguments).forEach(function(merge_with, i) {
        if (i === 0) {
            return;
        }
        for (var key in merge_with) {
            if (!merge_with.hasOwnProperty(key) || key in merge_what) continue;
            merge_what[key] = merge_with[key];
        }
    });
    return merge_what;
};
exports.humanize = function(underscored) {
    var res = underscored.replace(/_/g, ' ');
    return res[0].toUpperCase() + res.substr(1);
};