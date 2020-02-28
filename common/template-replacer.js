/**
 * @file template-replacer
 */
var keyReg = function () {
    return /@\{(\w+)\}@/g;
}

var TemplateReplacer = function (content) {
    this._content = content;
}

TemplateReplacer.prototype = {
    _content: '',

    applyData: function(data) {
        this._content = this._content.replace(keyReg(), function (match, key) {
            if (key in data) {
                return data[key];
            }
        })
        return this;
    },

    setContent: function (content) {
        this._content = content
        return this;
    },

    getContent: function () {
        return this._content;
    },

    applyDataAndReturn: function(data) {
        return this.applyData(data).getContent();
    }
}

module.exports = function () {
    var templateReplacer = new TemplateReplacer()
    return templateReplacer;
}
