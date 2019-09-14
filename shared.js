// TODO(bobbyluig): Switch this to the production endpoint.
const PLAID_ENV = 'sandbox';
const PLAID_ENDPOINT = 'https://sandbox.plaid.com';

// TODO(bobbyluig): The secret key should not be stored here.
const PLAID_CLIENT_ID = '5d01659c1c640200135de6f6';
const PLAID_PUBLIC_KEY = '9a6fba9148382e6bcc57e8a0f93850';
const PLAID_SECRET_KEY = '683dcc0ab325c92a769e815f50b41a';

const STORAGE_TOKENS = 'divineInterventionTokens';

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

function accountsGet(accessToken) {
  return postData(PLAID_ENDPOINT + '/accounts/get', {
    client_id: PLAID_CLIENT_ID,
    secret: PLAID_SECRET_KEY,
    access_token: accessToken
  })
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

function getVisibleText() {
  window.getSelection().removeAllRanges();

  const range = document.createRange();
  range.selectNode(document.body);
  window.getSelection().addRange(range);

  const visibleText = window.getSelection().toString().trim();
  window.getSelection().removeAllRanges();

  return visibleText;
}
