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
    containerMap: {}

    # Function to kill all requests
    killAll: ->
      for req_id in RQ.container
        key = RQ.container[req_id]
        RQ.containerMap[key].abort()
        RQ.container = []
        RQ.containerMap = {}

    # Function to add a request to the container
    # First parameter is the AJAX Request, second is a optional unique ID
    add: (req,req_id) ->
      if typeof RQ.beforeAdd is "function"
        RQ.beforeAdd()
        req_id = req_id or "rq_#{RQ.container.length + 1}"
        req.container_id = req_id
        if req isnt false
          RQ.container.push req_id
          RQ.containerMap[req_id] = req
        if typeof RQ.afterAdd is "function"
          RQ.afterAdd()

    # Function to remove a request of the container
    # First parameter is the AJAX Request, second is a optional unique ID
    remove: (condition) ->
      if typeof RQ.beforeRemove is "function"
        RQ.beforeRemove()
        if typeof condition is "object"
          for key,request of RQ.containerMap
            if request is condition["request"]
              index = $.inArray(key,RQ.container)
              oldkey = key
              break
            else
              index = $.inArray(condition,RQ.container)
            oldkey = condition
        RQ.container.splice index,1
        delete RQ.containerMap[condition]
        if typeof RQ.afterRemove is "function"
          RQ.afterRemove()

    # Function to remove a request of the container(it'll automatically abort)
    # First parameter is the AJAX Request, second is a optional unique ID
    kill: (condition) ->
      if typeof condition is "object"
        for key,request of RQ.containerMap
          if request is condition["request"]
            oldkey = key
            break
          else
            oldkey = condition
        if RQ.containerMap[oldkey] isnt false
          RQ.container[oldkey].abort()
        RQ.remove oldkey

    # Function to remove all requests on the container matching a regex
    # First parameter is a RegExp object
    killByRegex: (condition) ->
      for key in RQ.container
        if key.match condition
          if RQ.containerMap[key] isnt false
            RQ.containerMap[key].abort()
            RQ.remove key

    # Function to show all requests on the container
    showAll: ->
      requests = ""
      for key,request of RQ.containerMap
        requests += "id: #{key},request: #{request}\n"
      requests

# This is necessary to remove a request of the container after it is complete
$(document).ajaxComplete (e,xhr,settings) ->
  if xhr.container_id?
    RQ.remove xhr.container_id
