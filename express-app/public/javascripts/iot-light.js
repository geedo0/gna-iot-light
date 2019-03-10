var endpoint_url = 'https://bomb.com';

function blink_handler(e) {
  fetch(endpoint_url + '/blink', {method: 'POST'})
    .catch(function(reason) {
      console.log('Error blinking lights.');
      console.log(reason);
    });
};

var btn = document.querySelector('.blink-button');
btn.addEventListener('click', blink_handler);
