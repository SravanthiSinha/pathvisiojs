(function(window){

  var optionsDefault = {
        displayErrors: true
      , displayWarnings: false
      }
    , instancesMap = {}

  /**
   * Init plugin
   * @param {pathvisiojs instance} pvjs
   * @param {object} options
   * @return {object} PathvisiojsNotifications instance
   */
  function init(pvjs, options) {
    // Create new instance if it does not exist
    if (!instancesMap.hasOwnProperty(pvjs.instanceId)) {
      instancesMap[pvjs.instanceId] = new PathvisiojsNotifications(pvjs, options)
    }

    return instancesMap[pvjs.instanceId]
  }

  /**
   * Plugin constructor
   * @param {pathvisiojs instance} pvjs
   * @param {objects} options
   */
  function PathvisiojsNotifications(pvjs, options) {
    var $notifications = $('<div class="pathvisiojs-notifications">').appendTo($(pvjs.$element[0][0]))
      , options = options || {}
      , notifications = []
      , lastNotification = {type: null, message: '', counter: 0, $element: null}

    // Copy default options
    for (var i in optionsDefault) {
      if (optionsDefault.hasOwnProperty(i) && !options.hasOwnProperty(i)) {
        options[i] = optionsDefault[i]
      }
    }

    if (options.displayErrors) {
      pvjs.on('error', function(data){
        addPathvisiojsNotification($notifications, 'danger', '<strong>Error!</strong> ' + data.message, notifications)
      })
    }

    if (options.displayWarnings) {
      pvjs.on('warning', function(data){
        addPathvisiojsNotification($notifications, 'warning', '<strong>Warning!</strong> ' + data.message, notifications)
      })
    }
  }

  /**
   * Search for a notification in a list of notifications
   * @param  {String} type
   * @param  {String} message
   * @param  {Array} notifications List of notifications
   * @return {Object|Null}               Notification or Null
   */
  function getNotification(type, message, notifications) {
    for (var n in notifications) {
      if (notifications[n].type === type && notifications[n].message === message) {
        return notifications[n]
      }
    }

    return null
  }

  /**
   * Remove a notification from a list of notifications
   * @param  {Object} notification Notification to search for
   * @param  {Array} notifications List of notifications
   */
  function removeNotification(notification, notifications) {
    for (var n in notifications) {
      if (notifications[n] === notification) {
        notifications.splice(n, 1)
      }
    }
  }

  /**
   * Append the element to notifications container
   * @param {d3 selector} $container
   * @param {string} type. danger, warning, success, info
   * @param {string} message
   */
  function addPathvisiojsNotification($container, type, message, notifications){
    var notification = getNotification(type, message, notifications)

    if (notification !== null) {
      notification.counter += 1

      // Increment counter
      notification.$element.find('.counter').show().text(notification.counter)
    } else {
      var $notification = $('<div class="alert alert-' + type + '">')
        .html(message)
        .appendTo($container)

      notification = {
        type: type
      , message: message
      , counter: 1
      , $element: $notification
      }

      // Add close button
      $('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span></button>')
        .prependTo($notification)
        .on('click', function(){
          removeNotification(notification, notifications)
          $(this).parent().remove()
        })

      // Add counter
      $('<span class="counter">1</span>')
        .hide()
        .prependTo($notification)

      notifications.push(notification)
    }
  }

  /**
   * Expose plugin globally
   */
  window.pathvisiojsNotifications = init
})(window)
