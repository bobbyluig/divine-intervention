let iframe;

function isCheckoutPage() {
  return true;
}

function showModal() {
  iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('modal.html');
  iframe.style = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:2147483647;border-width:0px;display:block;overflow:hidden auto;';

  document.body.appendChild(iframe);
}

window.addEventListener('message', event => {
  switch (event.data.method) {
    case 'closeModal': {
      $(iframe).remove();
    }
  }
}, false);

showModal();


