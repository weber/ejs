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
function genericTagSelfclosing(name, params, override) {
    return html('<' + name + htmlTagParams(params, override) + ' />');
}

var link_to = exports.linkTo = function linkTo(text, url, params) {
    ['remote', 'method', 'jsonp', 'confirm'].forEach(dataParam.bind(params));
    return Helpers.tag('a', text, {href: url}, params);
}
exports.metaTag = function (name, content, params) {
    var undef;
    params = params || {};
    if (content && typeof content === 'object') {
        params = content;
        content = undef || params.content;
    }
    if (name && typeof name === 'object') {
        params = name;
        name = undef || params.name;
        content = undef || params.content;
    }
    return genericTagSelfclosing('meta', {name: name, content: content}, params);
};

exports.linkToRemote = function linkToRemote(text, url, params) {
    params = params || {};
    params.remote = true;
    return this.linkTo(text, url, params);
};
var link_to_if_not_current = exports.linkToIfNotCurrent = function linkToIfNotCurrent(text, url, params) {
    if (url && url[0]=='/') url = url.substring(1);  //trim first '/' if exists
    return (url.toLowerCase() == window.location.pathname.substring(1).toLowerCase() ) ? text : link_to(text, url, params) ;
};
var inputTag = exports.inputTag = function (params, override) {
    return '<input' + htmlTagParams(params, override) + ' />';
};

var textareaTag = exports.textareaTag = function (value, params, override) {
    if (typeof value === 'object') {
        params = value;
        override = params;
        value = params.value;
    }
    return Helpers.tag('textarea', value || '', params, override);
};
var labelTag = exports.labelTag = function (text, params, override) {
    return Helpers.tag('label', text, params, override);
};
var submitTag = exports.submitTag = function (text, params) {
    return this.inputTag({value: text, type: 'submit'}, params);
};

var buttonTag = exports.buttonTag = function (text, params) {
    return Helpers.tag('button', text, params);
};
var selectTag = exports.selectTag = function (innerOptions, params, override) {
    return Helpers.tag('select', html(innerOptions), params, override);
};
var optionTag = exports.optionTag = function (text, params, override) {
    return Helpers.tag('option', text, params, override);
};
var icon = exports.icon = function (type, params) {
    return Helpers.tag('i', '', {class: 'icon-' + type}, params) + ' ';
};
var imageTag = exports.imageTag = function (src, params) {
    return genericTagSelfclosing('img', {src: src}, params);
};
var anchor = exports.anchor = function(name, params) {
    params = params || {};
    params.name = name;
    return link_to('', '', params);
};