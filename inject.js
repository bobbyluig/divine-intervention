let iframe;

// {"override_accounts":[{"starting_balance":754.83,"type":"credit","subtype":"credit card","meta":{"name":"Amazon Prime Rewards Visa Signature Card","number":"0518","limit":1200}},{"starting_balance":2645.11,"type":"depository","subtype":"checking","meta":{"name":"Chase Checking","number":"8830"}},{"starting_balance":300.82,"type":"depository","subtype":"savings","meta":{"name":"Chase Saving","number":"4396"}}]}

// {"override_accounts":[{"starting_balance":868.84,"type":"credit","subtype":"credit card","meta":{"name":"Savor One","number":"9241","limit":8000}}]}

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

let url;

function run() {
  if (window.location.href === url) {
    setTimeout(run, 100);
    return;
  }

  url = window.location.href;

  for (const extractor of EXTRACTORS) {
    if (extractor.match(url)) {
      getAllBalances().then(user => {
        const args = [user, extractor.card(), extractor.total()];
        showModal();
        $(iframe).on('load', () => {
          iframe.contentWindow.postMessage({method: 'data2Charts', args: args}, '*');
        });
      });
      setTimeout(run, 100);
      return;
    }
  }

  setTimeout(run, 100);
}

$(document).ready(() => {
  run();
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    url = '';
    sendResponse({})
  }
);