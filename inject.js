function isCheckoutPage() {
  return true;
}

function loadCSS(dom, file) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', chrome.runtime.getURL(file));
  dom.appendChild(link);
}

const div = document.createElement('div');
const shadowRoot = div.attachShadow({mode: 'open'});
fetch(chrome.runtime.getURL('modal.html')).then(html => {
  html.text().then(text => {
    shadowRoot.innerHTML = text;
    loadCSS(shadowRoot, 'lib/css/bootstrap.min.css');
    loadCSS(shadowRoot, 'modal.css');
    document.body.appendChild(div);
  });
});
