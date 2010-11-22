/**
* Container de requests AJAX
* @name RQ
* @class
*/
var RQ = {
    container: [],
    /**
    * Função para excluir todas as requests do container
    * @function
    */
    killAll: function() {
       for(var i in RQ.container) {
           if(RQ.container[i]["request"] !== false)
               RQ.container[i]["request"].abort();
       }
       RQ.container = [];
    },
    /**
    * Função para adicionar uma request ao container
    * @param req  Request a ser adicionada
    * @param req_id  Um id único para a request
    * @function
    */
    add: function(req,req_id) {
        req_id = req_id || "rq_"+RQ.container.length + 1;
        if(req !== false)
            RQ.container.push({id: req_id,request: req});
    },
    /**
    * Função para buscar uma request no container
    * @param condition  Recebe a request ou o id da request como parâmetro de busca
    * @function
    */
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
    /**
    * Função para remover uma request do container
    * @param condition  Recebe a request ou o id da request como parâmetro de busca
    * @function
    */
    remove: function(condition) {
        var index = RQ.find(condition);
        if(index > -1)
            RQ.container.splice(index,1);
    },
    /**
    * Função para excluir uma request do container(ela será automaticamente abortada)
    * @param condition  Recebe a request ou o id da request como parâmetro de busca
    * @function
    */
    kill: function(condition) {
        var index = RQ.find(condition);
        if(index > -1) {
            if(RQ.container[index]["request"] !== false)
                RQ.container[index]["request"].abort();
            RQ.container.splice(i,1);
        }
    },
    /**
    * Função para exibir todas as requests no container
    * @function
    */
    showAll: function() {
        var requests = "";
        for(var i in RQ.container) {
            requests += "id: "+RQ.container[i]["id"]+",request:"+
            RQ.container[i]["request"]+"\n";
        }
        return requests;
    }
};


/** Remover a request do container após sua resposta */
$(document).ajaxComplete(function(e,xhr,settings) {
    RQ.remove({request:xhr});
});

