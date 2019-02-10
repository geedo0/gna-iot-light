function random(number) {
  return Math.floor(Math.random()*(number+1));
}

function clickHandler(e) {
  console = document.querySelector('.console');
  console.style.backgroundColor = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
}

var btn = document.querySelector(".blink-button");
btn.addEventListener('click', clickHandler);
