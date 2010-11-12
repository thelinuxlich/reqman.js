var RQ = {
    container: [],
    killAll: function() {
       for(var i in RQ.container) {
           if(RQ.container[i]["request"] !== false)
               RQ.container[i]["request"].abort();
       }
       RQ.container = [];
    },
    add: function(req_id,req) {
        if(req !== false)
            RQ.container.push({id: req_id,request: req});
    },
    find: function(condition) {
        var index = -1;
        var field = "";
        field = (condition["request"] !== undefined ? "request" : "id");
        for(var i in RQ.container) {
           if(RQ.container[i][field] === condition[field]) {
                index = i;
                break;
           }
        }
        return index;
    },
    remove: function(condition) {
        var index = RQ.find(condition);
        if(index > -1)
            RQ.container.splice(index,1);
    },
    kill: function(condition) {
        var index = RQ.find(condition);
        if(index > -1) {
            if(RQ.container[index]["request"] !== false)
                RQ.container[index]["request"].abort();
            RQ.container.splice(i,1);
        }
    },
    showAll: function() {
        var requests = "";
        for(var i in RQ.container) {
            requests += "id: "+RQ.container[i]["id"]+",request:"+
            RQ.container[i]["request"]+"\n";
        }
        return requests;
    }
};

$(document).ajaxComplete(function(e,xhr,settings) {
    RQ.remove({request:xhr});
});

