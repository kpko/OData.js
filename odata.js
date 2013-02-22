var OData = (function() {

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

  // Instance methods
  OData.prototype.orderby = function(properties) {
    var args;

    if(isArray(properties)) {
      args = properties;
    } else {
      args = Array.prototype.slice.call(arguments);
    }

    var orderbyStatements = this.statements.filter(function(item) {
      return item.type == 'orderby';
    });

    // If there is already an orderby statement, augment it with the new arguments
    if(orderbyStatements.length > 0) {
      var orderbyStatement = orderbyStatements[0];
      orderbyStatement.properties = orderbyStatement.properties.concat(args);
    } else {
      this.statements.push({ type: 'orderby', properties: args });
    }

    return this;
  };

  OData.prototype.skip = function(amount) {
    this.statements.push({ type: 'skip', amount: amount });
    return this;
  };

  OData.prototype.top = function(amount) {
    this.statements.push({ type: 'top', amount: amount });
    return this;
  };

  OData.prototype.get_statements = function() {
    return this.statements;
  };

  OData.prototype.url = function() {
    var url = this.baseUrl;

    if (!endsWith(url, '\\?')) {
      url += '?';
    }

    for(var i = 0; i < this.statements.length; i++) {
      var stmt = this.statements[i];

      switch(stmt.type) {
        case 'orderby':
          url += '$orderby=' + stmt.properties.join(',');
        break;
        case 'skip':
          url += '$skip=' + stmt.amount;
        break;
        case 'top':
          url += '$top=' + stmt.amount;
        break;
      }
    }

    return url;
  };

  return OData;

})();