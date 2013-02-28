var OData = (function () {

    // Constructor function
    function OData(baseUrl) {
        this.baseUrl = baseUrl;
        this.statements = [];
    }

    // Utilities
    function endsWith(str, term) {
        return str.match(new RegExp(term + '$'));
    }
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    function format(format, replacements) {
        var formatted = format;

        for (var i = 0; i < replacements.length; i++) {
            var regexp = new RegExp('\\{' + (i) + '\\}', 'gi');
            formatted = formatted.replace(regexp, replacements[i]);
        }
        return formatted;
    };
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fun /*, thisp */) {
            "use strict";

            if (this == null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun != "function")
                throw new TypeError();

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, t))
                        res.push(val);
                }
            }

            return res;
        };
    }

    // Instance methods
    OData.prototype.orderby = function (properties) {
        var args;

        if (isArray(properties)) {
            args = properties;
        } else {
            args = Array.prototype.slice.call(arguments);
        }

        var orderbyStatements = this.statements.filter(function (item) {
            return item.type == 'orderby';
        });

        // If there is already an orderby statement, augment it with the new arguments
        if (orderbyStatements.length > 0) {
            var orderbyStatement = orderbyStatements[0];
            orderbyStatement.properties = orderbyStatement.properties.concat(args);
        } else {
            this.statements.push({ type: 'orderby', properties: args });
        }

        return this;
    };

    OData.prototype.skip = function (amount) {
        this.statements.push({ type: 'skip', amount: amount });
        return this;
    };

    OData.prototype.top = function (amount) {
        this.statements.push({ type: 'top', amount: amount });
        return this;
    };

    OData.prototype.get_statements = function () {
        return this.statements;
    };

    OData.prototype.url = function () {
        var url = this.baseUrl;

        if (!endsWith(url, '\\?')) {
            url += '?';
        }

        for (var i = 0; i < this.statements.length; i++) {
            var stmt = this.statements[i];

            if (i > 0 && i < this.statements.length) {
                url += '&';
            }

            switch (stmt.type) {
                case 'orderby':
                    url += '$orderby=' + stmt.properties.join(',');
                    break;
                case 'skip':
                    url += '$skip=' + stmt.amount;
                    break;
                case 'top':
                    url += '$top=' + stmt.amount;
                    break;
                case 'filter':
                    url += '$filter=' + stmt.string;
                    break;
            }
        }

        return url;
    };

    OData.prototype.filter = function (filterString) {
        var args = Array.prototype.slice.call(arguments);
        args = args.slice(1);

        filterString = format(filterString, args);

        var stmt = { type: 'filter', string: filterString };
        this.statements.push(stmt);

        return this;
    };

    return OData;

})();