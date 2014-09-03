/**
 * Created by webs on 03.09.14.
 */
var utils = require('./utils');

var htmlTagParams = utils.html_tag_params,
    safe_merge = utils.safe_merge,
    humanize = utils.humanize;

var Helpers ={};
Helpers.tag = genericTag;
Helpers.text = sanitizeHTML;

/**
 * Prefixes key with 'data-'
 *
 * @param {String} key name of key
 */
function dataParam(key) {
    if (this[key]) {
        this['data-' + key] = this[key];
        delete this[key];
    }
}
function genericTag(name, inner, params, override) {
    return html('<' + name + htmlTagParams(params, override) + '>' + this.text(inner) + '</' + name + '>');
}
function html(res) {
    res = new String(res);
    res.toHtmlString = function() {
        return this;
    };
    return res;
}
/**
 * Escape &, < and > symbols
 *
 * @param {String} html String with possible HTML-Elements
 * @returns {String} resulting string with escaped characters
 */
function sanitizeHTML(text) {
    if (!this.htmlEscape) return text;
    if (typeof text === 'object') {
        if (text instanceof String && text.toHtmlString) {
            return text.toHtmlString();
        }
        text = JSON.stringify(text, null, '   ');
    }
    return text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
}

exports.linkTo = function linkTo(text, url, params) {
    ['remote', 'method', 'jsonp', 'confirm'].forEach(dataParam.bind(params));
    return Helpers.tag('a', text, {href: url}, params);
}