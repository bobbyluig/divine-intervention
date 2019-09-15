// TODO(bobbyluig): Switch this to the production endpoint.
const PLAID_ENV = 'sandbox';
const PLAID_ENDPOINT = 'https://sandbox.plaid.com';

// TODO(bobbyluig): The secret key should not be stored here.
const PLAID_CLIENT_ID = '5d01659c1c640200135de6f6';
const PLAID_PUBLIC_KEY = '9a6fba9148382e6bcc57e8a0f93850';
const PLAID_SECRET_KEY = '683dcc0ab325c92a769e815f50b41a';

const EXTRACTORS = [
  {
    match: url => url.startsWith('https://www.amazon.com/gp/buy/payselect'),
    total: () => document.body.getElementsByClassName('grand-total-price')[0].innerText.slice(1),
    card: () => document.body.getElementsByClassName('pmts-selected')[0]
      .getElementsByClassName('pmts-cc-number')[0].innerText.slice(10)
  }
];

function getStorage() {
  return chrome.storage.promise.local.get({
    divineIntervention: {},
  })
    .then(result => result.divineIntervention);
}

function setStorage(value) {
  return chrome.storage.promise.local.set({
    divineIntervention: value,
  });
}

function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json());
}

function balanceGet(accessToken) {
  return postData(PLAID_ENDPOINT + '/accounts/balance/get', {
    client_id: PLAID_CLIENT_ID,
    secret: PLAID_SECRET_KEY,
    access_token: accessToken
  })
}

function exchangeToken(publicToken) {
  return postData(PLAID_ENDPOINT + '/item/public_token/exchange', {
    client_id: PLAID_CLIENT_ID,
    secret: PLAID_SECRET_KEY,
    public_token: publicToken
  })
}

function transactionsGet(accessToken) {
  const startDateString = new Date().toISOString().slice(0, 10);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 5);
  const endDateString = endDate.toISOString().slice(0, 10);

  return postData(PLAID_ENDPOINT + '/item/public_token/exchange', {
    client_id: PLAID_CLIENT_ID,
    secret: PLAID_SECRET_KEY,
    access_token: accessToken,
    start_date: startDateString,
    end_date: endDateString,
  })
}

function getAllBalances() {
  return getStorage()
    .then(storage => storage.items || {})
    .then(items => Object.values(items).map(item => balanceGet(item.accessToken)))
    .then(promises => Promise.all(promises))
    .then(items => items.flatMap(item => item.accounts));
}

function getAllAccounts() {
  return getStorage()
    .then(storage => storage.items || {})
    .then(items => Object.values(items).flatMap(item => item.accounts));
}

function getAllAccountsByIns() {
  return getStorage()
    .then(storage => storage.items || {});
}

function getVisibleText() {
  window.getSelection().removeAllRanges();

  const range = document.createRange();
  range.selectNode(document.body);
  window.getSelection().addRange(range);

  const visibleText = window.getSelection().toString().trim();
  window.getSelection().removeAllRanges();

  return visibleText;
}
