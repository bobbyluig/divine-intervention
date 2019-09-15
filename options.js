function addItem(publicToken, metadata) {
  return exchangeToken(publicToken)
    .then(response => {
      return getStorage()
        .then(storage => {
          const items = storage.items || {};
          items[metadata.institution.institution_id] = {
            accessToken: response.access_token,
            accounts: metadata.accounts
          };
          storage.items = items;
          return storage;
        })
        .then(setStorage);
    });
}

function removeItem(institution) {
  return getStorage()
    .then(storage => {
      const items = storage.items || {};
      delete items[institution];
      storage.items = items;
      return storage;
    })
    .then(setStorage);
}

$(document).ready(function () {
  const linkHandler = Plaid.create({
    clientName: 'Divine Intervention',
    countryCodes: ['US'],
    env: PLAID_ENV,
    key: PLAID_PUBLIC_KEY,
    product: ['transactions'],
    language: 'en',
    onSuccess: addItem
  });

  $('#link').click(function () {
    linkHandler.open();
  });
});