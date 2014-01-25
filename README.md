history-easy.js
===============

This is a wrapper for the Javascript HTML5 history API for modern and updated browsers -- Firefox, Chrome, Safari, Opera, and IE10+.
<br/><br/>
What's it for, and why use it?
<br/>
<br/><b>1)</b> It provides an automatic way for handling the back button.
<br/><b>2)</b> It allows you to bundle state data with URLs, titles, and inline callbacks.
<br/><b>3)</b> Extras include a streamlined structure for you to handle (or prevent) history state changes via an "onbeforestatechange" function, "onstatechange" function, and a default state variable.
<br/><b>4)</b> You can customize it, modify it, or transmogrify it: it is public domain, and the code base is about 140 lines, with the core less than 100 lines.

If you found this function useful, financial support is always appreciated: https://www.gittip.com/agamemnus/

The license is public domain.

Table of Contents
-------------------------

[Short Example Code](#example-code) <br/>
[Control Flow, Simplified](#control-flow-simplified) <br/>
[Control Flow, Detailed/Extensive](#control-flow-detailedextensive) <br/>

Example Code
-------------------------

Check out this code or [view the interactive example](http://agamemnus.github.io/history-easy.js/) -- with slightly more code.

````Javascript
var history_control = new history_control_object ({
 'onstatechange' : function (new_state, callback) {
  document.body.innerHTML = new_state.fruit
  callback ()
 }
})
 
history_control.load_page (
 {fruit: 'Current fruit: "apple". Changes to "pear" in 2 seconds.'},
 {url: 'apple', title: 'Apple.', callback: function () {console.log ("The page changed.")
  setTimeout (function () {
   history_control.load_page ({fruit: 'Current fruit: "pear". Try the back button!'}, {url: 'pear', title: 'Pear.'})
  }, 2000)
 }}
)
````

Control Flow, Simplified
-------------------------
See example and/or code. In summary:
<br/>
<br/><b>1)</b> Create a new function object, then use .load (state, settings).
<br/><b>2)</b> The wrapper adds a title, URL, and custom callback attribute for each entry hash. To set these, populate the settings object when using .load_page: .title, .new_url, and .callback.
<br/><b>3)</b> The function object runs .onbeforestatechange, if it is defined. If there's no callback in that function, the new history loading process ends. The callback continues the new history loading process.
<br/><b>4)</b> The function changes the state and adds the title/url/custom callback attribute.
<br/><b>5)</b> The function runs .onstatechange, if it is defined.
<br/><b>6)</b> The function runs the custom callback, if it is defined. (as a callback -- the second parameter of .onstatechange)

Control Flow, Detailed/Extensive
-------------------------
Note: throughout the documentation, the new history object will be referred to as "history_main".
<br/>
<br> First, a new instance of <b>history_control_object</b> must be created. For example:
````Javascript
var history_main = this.history_control = new history_control_object ({
 // Determines if the first call to .page_load should overwrite the provided new_state with the initial window.location. (true) This is true by default.
 'overwrite_first_state': true,
 // Function called before history changes. To prevent continuation, simply don't run the callback.
 'onbeforestatechange' : function (new_state, settings, callback) {
  // <Your code here.>
  //  ...
  // </Your code here.>
  callback () // If this isn't run, the history load does not continue.
 },
 // Function called when the history changes.
 'onstatechange' : function (new_state, callback) {
  // <Your code here.>
  //  ...
  // </Your code here.>
  callback () // Should finish by running any optionally defined callback.
 },
 // The "var_name" variable will be a property of history_main and accessed/modified
 // as if it was a history state value.
 'var_name'      : 'page',
  // "initial_page" is the initial page value for the "var_name" property variable.
 'initial_page'  : 0,
 'base_filename' : '',
 // (4) a persistent variable holding the URL GET variables.
 'app_url_vars'  : test_main.app_url_vars
})
````
<br/> At any time, <b>history_main</b>'s <i>.overwrite_first_state</i>, <i>.base_filename</i>, <i>.onbeforestatechange</i>, <i>.onstatechange</i>, <i>.initial_page</i>, <i>.app_url_vars</i>, <i>.title</i>, <i>.url</i>, and <i>.callback</i> are significant properties that can be accessed or modified.
<br/>
<br/>There is one built-in exposed function property in the history object:
<br/><b>history_main.load_page (<i>new_state</i>, <i>settings</i>)</b>
<br/>This "loads" a new page with the specified history state (<i>new_state</i>) and <i>settings</i>. <i>new_state</i> should be an object with string properties. This represents the HTML5 history state. The <b>history_main.load_page</b> function is not destructive towards its parameters: it shallow the copies both <i>new_state</i> and <i>settings</i> variables.
<br/>
<br/>In the first call to <b>history_main.load_page</b>, <i>new_state</i> is overwritten by window.location's URL parameters. E.G.: "mypage.htm?page=apples" sets <i>new_state</i> to {page: 'apples'}, by default. Setting the <i>history_main.overwrite_first_state</i> property to a boolean "false" will prevent the default overwrite.
<br/>
<br/>Similarly, in the first call to <b>history_main.load_page</b>, <i>history_main[var_name]</i> (by default, <i>new_state['page']</i>) is set to <i>history_main.initial_page</i>.
<br/>
<br/><i>new_state[var_name]</i> is then set to <i>history_main[var_name]</i> if <i>new_state[var_name]</i> is undefined.
<br/>
<br/>After these variables are set (or not), the user-supplied <b>history_main.onbeforestatechange</b> function is run, if it exists. If it does not exist, the code jumps to the internal <b>set_page_state</b> function. <b>history_main.onbeforestatechange</b> has 3 parameters: <i>new_state</i>, <i>settings</i>, and <i>callback</i>. <i>new_state</i> and <i>settings</i> are the shallow-copied variables supplied in <b>history_main.load_page</b>. <i>callback</i> is the function that should be called to continue the page load sequence.
<br/>
<br/> Continuing from <b>history_main.load_page</b> or clicking the back button of the browser directs the loading sequence to <b>set_page_state</b>, which has the familiar parameters <i>new_state</i>, <i>settings</i>, and the  <i>record_history</i> parameter. <i>record_history</i> is true if arriving from <b>history_main.load_page</b> and false if arriving from the back button event handler. (formally, a window "popstate" event listener)
<br/>
<br/> The <b>set_page_state</b> function checks options for the parameters <i>title</i>, <i>url</i>, and <i>callback</i>. If any of those are set, or if these parameters were set via history_main (eg: history_main.title = "Apples"), they are added internally as pairings to the current state. The <i>title</i> parameter sets the document's title, <i>url</i> sets the visible URL, and <i>callback</i> is a function that is run at the end of the page load. These variables are saved and bound to the current <i>new_state</i> such that clicking the "back" button gets and runs these saved parameters.
<br/>
<br/> If the <b>set_page_state</b> function was called from the popstate event listener, <i>history_main[var_name]</i> is set to <i>new_state[var_name]</i>.
<br/>
<br/> The actual HTML5 history API is now invoked: replaceState if it is the first time it is invoked, and pushState otherwise -- with the accompanying page state, title, and URL. The URL is set to <i>options.url</i> (with a base of <i>location.protocol + '//' + location.host + location.pathname + history_main.base_filename</i>) if <i>options.url</i> exists; otherwise, it is the hash of the <i>new_state</i> variable.
<br/>
<br/> After the HTML5 history API is invoked, <b>history_main.onstatechange</b> is run.
<br/> If <b>history_main.onstatechange</b> is not defined, the <i>callback</i> function specified in <i>options</i> is immediately run, and the page load is complete.
<br/>
<br/> If <b>history_main.onstatechange</b> is defined, it is run with a <i>new_state</i> parameter and a secondary <i>options.callback</i> parameter. <i>options.callback</i> is not called within the <b>set_page_state</b> function in this case: it must be invoked within <b>history_main.onstatechange</b>.
