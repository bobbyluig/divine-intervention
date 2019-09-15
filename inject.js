let iframe;

exampleUser = [{
  'account_id': 'vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D',
  'balances': {
    'available': 200,
    'current': 200,
    'limit': null,
    'iso_currency_code': 'USD',
    'unofficial_currency_code': null,
  },
  'mask': '0000',
  'name': 'Plaid Checking',
  'official_name': 'Plaid Gold Checking',
  'subtype': 'checking',
  'type': 'depository',
  'verification_status': null
}, {
  'account_id': '6Myq63K1KDSe3lBwp7K1fnEbNGLV4nSxalVdW',
  'balances': {
    'available': null,
    'current': 140,
    'limit': 200,
    'iso_currency_code': 'USD',
    'unofficial_currency_code': null,
  },
  'mask': '3333',
  'name': 'Plaid Credit Card',
  'official_name': 'Plaid Diamond Credit Card',
  'subtype': 'credit card',
  'type': 'credit'
}];

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
  });