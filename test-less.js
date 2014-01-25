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
