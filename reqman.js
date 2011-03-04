(function() {
  this.RQ = {
    beforeAdd: null,
    afterAdd: null,
    beforeRemove: null,
    afterRemove: null,
    container: [],
    killAll: function() {
      var i;
      for (i in RQ.container) {
        if (RQ.container[i]["request"] !== false) {
          RQ.container[i]["request"].abort();
        }
      }
      return RQ.container = [];
    },
    add: function(req, req_id) {
      if (typeof RQ.beforeAdd === "function") {
        RQ.beforeAdd();
      }
      req_id = req_id || ("rq_" + (RQ.container.length + 1));
      if (req !== false) {
        RQ.container.push({
          id: req_id,
          request: req
        });
      }
      if (typeof RQ.afterAdd === "function") {
        return RQ.afterAdd();
      }
    },
    find: function(condition) {
      var field, i, index;
      index = -1;
      field = "";
      field = condition["request"] !== void 0 ? "request" : "id";
      for (i in RQ.container) {
        if (RQ.container[i][field] === condition[field]) {
          index = i;
          break;
        }
      }
      return index;
    },
    findByRegex: function(condition) {
      var i, indexes;
      indexes = [];
      for (i in RQ.container) {
        if (i["id"].match(condition)) {
          indexes.push(i);
        }
      }
      return indexes;
    },
    remove: function(condition) {
      var index;
      if (typeof RQ.beforeRemove === "function") {
        RQ.beforeRemove();
      }
      index = typeof condition === "object" ? RQ.find(condition) : condition;
      if (index > -1) {
        RQ.container.splice(index, 1);
      }
      if (typeof RQ.afterRemove === "function") {
        return RQ.afterRemove();
      }
    },
    kill: function(condition) {
      var index;
      index = RQ.find(condition);
      if (index > -1) {
        if (RQ.container[index]["request"] !== false) {
          RQ.container[index]["request"].abort();
        }
        return RQ.remove(condition);
      }
    },
    killByRegex: function(condition) {
      var i, indexes, _ref, _results;
      indexes = RQ.findByRegex(condition);
      _results = [];
      for (i = 0, _ref = indexes.length; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        if (RQ.container[indexes[i]]["request"] !== false) {
          RQ.container[indexes[i]]["request"].abort();
        }
        _results.push(RQ.remove(RQ.container[indexes[i]]["id"]));
      }
      return _results;
    },
    showAll: function() {
      var i, requests;
      requests = "";
      for (i in RQ.container) {
        requests += "id: " + RQ.container[i]['id'] + ",request: " + RQ.container[i]['request'] + "\n";
      }
      return requests;
    }
  };
  $(document).ajaxComplete(function(e, xhr, settings) {
    return RQ.remove({
      request: xhr
    });
  });
}).call(this);
