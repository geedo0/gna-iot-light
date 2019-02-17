function blink_handler(e) {
  fetch('/blink', {method: 'POST'})
    .catch(function(reason) {
      console.log('Error blinking lights.');
    });
};

var btn = document.querySelector('.blink-button');
btn.addEventListener('click', blink_handler);
