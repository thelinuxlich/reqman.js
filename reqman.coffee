# AJAX Request Container
@RQ =
    # Callback to execute before adding a request
    beforeAdd: null

    # Callback to execute after adding a request
    afterAdd: null

    # Callback to execute before removing a request
    beforeRemove: null

    # Callback to execute after removing a request
    afterRemove: null

    # The request container
    container: []

    # Function to kill all requests
    killAll: ->
        for i of RQ.container
            if RQ.container[i]["request"] isnt false
                RQ.container[i]["request"].abort()
        RQ.container = []

    # Function to add a request to the container.
    # First parameter is the AJAX Request, second is a optional unique ID
    add: (req,req_id) ->
        if typeof RQ.beforeAdd is "function"
            RQ.beforeAdd()
        req_id = req_id or "rq_#{RQ.container.length + 1}"
        if req isnt false
            RQ.container.push {id: req_id,request: req}
        if typeof RQ.afterAdd is "function"
            RQ.afterAdd()

    # Function to find a request on the container
    # First parameter is the request or the unique id to search
    find: (condition) ->
        index = -1
        field = ""
        field = if condition["request"] isnt undefined then "request" else "id"
        for i of RQ.container
            if RQ.container[i][field] is condition[field]
                index = i
                break
        index

    # Function to find all requests on the container matching a regex
    # First parameter is a RegExp object
    findByRegex: (condition) ->
        indexes = []
        for i of RQ.container
            if i["id"].match condition
                indexes.push i
        indexes;

    # Function to remove a request of the container
    # First parameter is the AJAX Request, second is a optional unique ID
    remove: (condition) ->
        if typeof RQ.beforeRemove is "function"
            RQ.beforeRemove()
        index = if typeof condition is "object" then RQ.find condition else condition
        if index > -1
            RQ.container.splice index,1
        if typeof RQ.afterRemove is "function"
            RQ.afterRemove()

    # Function to remove a request of the container(it'll automatically abort)
    # First parameter is the AJAX Request, second is a optional unique ID
    kill: (condition) ->
        index = RQ.find condition
        if index > -1
            if RQ.container[index]["request"] isnt false
                RQ.container[index]["request"].abort()
            RQ.remove condition

    # Function to remove all requests on the container matching a regex
    # First parameter is a RegExp object
    killByRegex: (condition) ->
        indexes = RQ.findByRegex condition
        for i in [0..indexes.length]
            if RQ.container[indexes[i]]["request"] isnt false
                RQ.container[indexes[i]]["request"].abort()
            RQ.remove RQ.container[indexes[i]]["id"]

    # Function to show all requests on the container
    showAll: ->
        requests = ""
        for i of RQ.container
            requests += "id: #{RQ.container[i]['id']},request: #{RQ.container[i]['request']}\n"
        requests

# This is necessary to remove a request of the container after it is complete
$(document).ajaxComplete (e,xhr,settings) ->
    RQ.remove {request:xhr}

