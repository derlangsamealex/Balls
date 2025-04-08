let t1
onload=function() {
  t1=setTimeout(init,500);
  alert("touch the screen to spawn balls")
}
function init() {
  let surface=new Surface();
  surface.start();
}