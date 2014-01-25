// (1) Define a persistent variable holding your URL GET variables.
// (2) define a function for the history control to call when a page should change. The function should have two parameters:
// (2a) the initial object/state.
// (2b) an internal callback function call that should run once the function finishes processing.
// (3) set an initial page value. (doesn't have to be a number; can be a string)
// (4) Set what the persistent URL variable in (1) is.
// (5) You can then do e.g. "history_control.load_page ({page_variable: page_value})" to add a history state.


test_function ()

function test_function () {
 var test_main = this
 test_main.app_url_vars = {}
 var history_control = this.history_control = new history_control_object ({
  'onstatechange'  : // (1): function called when the history changes.
   function (init, callback) { // (2a, 2b): init, internal callback.
    var page = init.page
    set_current_page (page)
    callback () // This is needed for any inline/custom callbacks to run.
   },
  'var_name'      : 'page',
  'initial_page'  : 0, // (3): initial page value.
  'base_filename' : '',
  'app_url_vars'  : test_main.app_url_vars // (4) a persistent variable holding your URL GET variables.
 })
 
 // Load the first page.
 // If the initial page variable named "var_name" is not defined on the next line, use the initial_page value defined in new history_control_object.
 // (ie: "{'page': test_main.app_url_vars.page}").
 history_control.load_page (undefined, {callback: page_zero_was_loaded})
 // history_control.load_page ({page:'5', callback: page_zero_was_loaded})
 
 // Load the second page, and set another title.
 function page_zero_was_loaded (init) {
  console.log ("Stand by. Loading next page in 3 seconds...")
  setTimeout (function () {
   test_main.app_url_vars.page = parseInt(test_main.app_url_vars.page) + 1
   history_control.title = "Page " + test_main.app_url_vars.page
   history_control.load_page ({page: test_main.app_url_vars.page}, {callback: function () {
    console.log ("The second page was loaded.")
   }})
  }, 3000)
 }
 
 function set_current_page (new_page) {
  document.body.innerHTML = 'We are on page: ' + new_page + '. Check the console log for further details...'
 }
}
