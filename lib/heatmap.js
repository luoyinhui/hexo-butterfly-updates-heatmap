window.toggleHistory = function(btn) {
  var history = document.getElementById('updates-history');
  if (history.style.display === 'none') {
    history.style.display = 'block';
    btn.innerText = '收起';
  } else {
    history.style.display = 'none';
    btn.innerText = '显示更多';
  }
}
