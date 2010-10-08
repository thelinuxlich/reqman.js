var AjaxFactory = {
    requestContainer: [],
    init: function(){
      $(document).ajaxComplete(function(e,xhr,settings) {
         AjaxFactory.removeRequest({request:xhr});
      });
    },
    killAllRequests: function() {
       for(var i in AjaxFactory.requestContainer) {
           if(AjaxFactory.requestContainer[i]["request"] !== false) {
               AjaxFactory.requestContainer[i]["request"].abort();
           }
       }
       AjaxFactory.requestContainer = [];
    },
    addRequest: function(req_id,req) {
        if(req !== false) {
            AjaxFactory.requestContainer.push({id: req_id,request: req});
        }
    },
    findRequest: function(condition) {
        var index = -1;
        var field = "";
        if(condition["request"] !== undefined) {
            field = "request";
        } else if(condition["id"] !== undefined) {
            field = "id";
        }
        for(var i in AjaxFactory.requestContainer) {
           if(AjaxFactory.requestContainer[i][field] === condition[field]) {
                index = i;
                break;
           }
        }
        return index;
    },
    removeRequest: function(condition) {
        var index = AjaxFactory.findRequest(condition);
        if(index > -1) {
            AjaxFactory.requestContainer.splice(index,1);
        }
    },
    killRequest: function(condition) {
        var index = AjaxFactory.findRequest(condition);
        if(index > -1) {
            if(AjaxFactory.requestContainer[index]["request"] !== false) {
                ajaxFactory.requestContainer[index]["request"].abort();
            }
            ajaxFactory.requestContainer.splice(i,1);
        }
    },
    showRequests: function() {
        var requests = "";
        for(var i in AjaxFactory.requestContainer) {
            requests += "id: "+AjaxFactory.requestContainer[i]["id"]+",request:"+
            AjaxFactory.requestContainer[i]["request"]+"\n";
        }
        return requests;
    }
};

