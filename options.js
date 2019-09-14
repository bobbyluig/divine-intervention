function getAllAccounts() {
  const keys = {};
  keys[STORAGE_TOKENS] = {};

  return chrome.storage.promise.local.get(keys)
    .then(result => {
      return Object.values(result[STORAGE_TOKENS]).map(accessToken => {
        return accountsGet(accessToken);
      })
    })
    .then(promises => Promise.all(promises))
    .then(items => items.flatMap(item => item.accounts));
}

function addItem(publicToken, metadata) {
  const keys = {};
  keys[STORAGE_TOKENS] = {};

  return exchangeToken(publicToken)
    .then(response => {
      return chrome.storage.promise.local.get(keys)
        .then(result => {
          result[STORAGE_TOKENS][metadata.institution.institution_id] = response.access_token;
          return result;
        })
        .then(chrome.storage.promise.local.set);
    });
}

$(document).ready(function () {
  var linkHandler = Plaid.create({
    clientName: 'Divine Intervention',
    countryCodes: ['US'],
    env: PLAID_ENV,
    key: PLAID_PUBLIC_KEY,
    product: ['transactions'],
    language: 'en',
    userLegalName: 'Lujing Cen',
    userEmailAddress: 'lujingcen@gmail.com',
    onSuccess: addItem
  });

  $('#link').click(function () {
    linkHandler.open();
  });
});