// History-easy.js version 1.0 by Michael Romanovsky. License: public domain.

// If you find this useful and would like to leave a financial gratuity, you can use this link:
// https://www.gittip.com/agamemnus/

function history_control_object (settings) {
 var history_main = this
 if (typeof settings == "undefined") settings = {}
 
 history_main.overwrite_first_state = ((typeof settings.overwrite_first_state != "undefined") && (settings.overwrite_first_state == false)) ? false : true
 var var_name                       = (typeof settings.var_name      != "undefined") ? settings.var_name      : 'page'
 history_main.base_filename         = (typeof settings.base_filename != "undefined") ? settings.base_filename : ""
 history_main.onbeforestatechange   = settings.onbeforestatechange // Function to run before the history state change. If it does run the callback (3rd parameter), no history state change is attempted.
 history_main.onstatechange         = settings.onstatechange       // Function to run after the history state change.
 history_main.initial_page          = settings.initial_page        // The initial page (default variable "page") that history should be at.
 history_main.app_url_vars          = settings.app_url_vars        // A set of variables that store the current history state.
 
 var extras = {}
 var next_title = undefined, next_url = undefined, next_callback = undefined
  
 var first_load = true
 
 // Add a pop state event listener.
 window.addEventListener ('popstate', function (evt) {if (evt.state == null) return; set_page_state (evt.state, undefined, false)})

 function set_page_state (new_state, settings, record_history) {
  // Update history_main.app_url_vars to match new_state.
  if (typeof history_main.app_url_vars != "undefined") {
   for (var i in history_main.app_url_vars) {delete (history_main.app_url_vars[i])}
   merge_into (history_main.app_url_vars, new_state)
  }
  
  var hash = formUrlVars (new_state, {record_undefined_values: false})
  // Set the title, url, and callback, if they exist in settings.
  if (typeof settings != "undefined") {
   if (typeof settings.title    != "undefined") history_main.title    = settings.title
   if (typeof settings.url      != "undefined") history_main.url      = settings.url
   if (typeof settings.callback != "undefined") history_main.callback = settings.callback
   
   if (typeof history_main.url == "undefined") {
    history_main.url = location.protocol + '//' + location.host + location.pathname + history_main.base_filename
    history_main.url += hash
   }
  }
  
  if (record_history == true) {
   extras[hash]          = {}
   extras[hash].title    = history_main.title
   extras[hash].url      = history_main.url
   extras[hash].callback = history_main.callback
  } else {
   history_main[var_name] = new_state[var_name]
  }
  
  // Set temporary variables.
  var current_title    = extras[hash].title
  var current_url      = extras[hash].url
  var current_callback = extras[hash].callback
  
  // Clear history_main.url and history_main.callback.
  delete (history_main.url); delete (history_main.callback)
  
  // Set the title and run the HTML5 History API pushState / replaceState function.
  document.title = (typeof current_title != "undefined") ? current_title : ""
  if (record_history == true) history[(first_load ? 'replace' : 'push') + 'State'] (new_state, current_title, current_url)
  
  if (first_load == true) first_load = false
  
  // Run the ".onstatechange" function property if it exists, then run the "current_callback" function.
  if (typeof history_main.onstatechange != "undefined") {
   history_main.onstatechange (new_state, function () {if (typeof current_callback != "undefined") current_callback ()})
  } else {
   if (typeof current_callback != "undefined") current_callback ()
  }
 }
 
 
 history_main.load_page = function (new_state, settings) {
  if (typeof new_state == "undefined") new_state = {}
  if (typeof settings  == "undefined") settings  = {}
  new_state = shallowcopy (new_state)
  settings  = shallowcopy (settings)
  // On first load, run a destructive function that merges the contents window.location with "history_main.app_url_vars".
  // On first load, set the initial page variable's (default: "page") value.
  if ((first_load == true) && (history_main.overwrite_first_state == true)) {
   getUrlVars (new_state)
   if (typeof history_main[var_name] == "undefined") history_main[var_name] = history_main.initial_page
  }
  if (typeof new_state[var_name] == "undefined") new_state[var_name] = history_main[var_name]
  
  // Run the .onbeforestatechange function property if it exists.
  if (typeof history_main.onbeforestatechange != "undefined") {
   history_main.onbeforestatechange (new_state, settings, function () {set_page_state (new_state, settings, true)})
  } else {
   set_page_state (new_state, settings, true)
  }
 }
 
 
 // Form a GET URL string from an array.
 function formUrlVars (variable_list, options) {
  if (typeof options                         == "undefined") options = {}
  if (typeof options.record_undefined_values == "undefined") options.record_undefined_values = true
  var return_value = ""
  for (var i in variable_list) {
  if ((typeof variable_list[i] != "undefined") || (options.record_undefined_values == true)) return_value += "&" + i + "=" + variable_list[i]}
  if (return_value != "") return_value = "?" + return_value.slice(1, return_value.length)
  return return_value
 }
 
 // Get URL variables from window.location and put them into variable_object as key/value pairs. Returns variable_object.
 function getUrlVars (variable_object) {
  if ((typeof variable_object != "object") || (variable_object == null)) var variable_object = {}
  var variable_list = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
  var curlen = variable_list.length
  for (var i = 0; i < curlen; i++) {
   var current_variable = variable_list[i].split('=')
   if (typeof current_variable[1] == "undefined") continue
   variable_object[current_variable[0]] = decodeURIComponent(current_variable[1])
  }
  return variable_object
 }
 
 // Merge the source into the target.
 function merge_into (target, source) {
  if (typeof source == "undefined") return target
  // Overrides any keys in the target object with keys in the source object.
  for (var property in source) {target[property] = source[property]}
  return target
 }
 
 // Shallow-copy an object.
 function shallowcopy (source) {
  if ((typeof source !== 'object') || (source == null)) return source
  var copy = ((source instanceof Array) ? [] : {})
  for (var i in source) {
   var property = source[i]
   if ((typeof property != 'object') || (!(property instanceof Array))) {copy[i] = property; continue}
   copy[i] = property.slice ()
  }
  return copy
 }
}
