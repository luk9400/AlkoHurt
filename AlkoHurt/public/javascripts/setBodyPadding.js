window.addEventListener('resize', function () {
  setBodyPadding()
});

window.addEventListener('load', function () {
  setBodyPadding();
});

function setBodyPadding() {
  try {
    let height = document.getElementsByTagName('footer')[0].clientHeight;
    height += 30;
    let padding = '0px 0px ' + height + 'px 0px';
    document.getElementsByTagName('body')[0].style.padding = padding;
  } catch (e) {
    console.log(e);
  }
}