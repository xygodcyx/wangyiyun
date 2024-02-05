function resize() {
  var width = document.documentElement.clientWidth || window.innerWidth;
  if (width > 750) {
    width = 750;
  } else if (width < 320) {
    width = 320;
  }
  document.documentElement.style.fontSize = width / 7.5 + 'px';
  document.body.style.fontSize = 0.3 + 'rem';
}
resize();

window.onresize = () => {
  resize();
};
