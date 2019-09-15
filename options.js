function addItem(publicToken, metadata) {
  return exchangeToken(publicToken)
    .then(response => {
      return getStorage()
        .then(result => {
          result[metadata.institution.institution_id] = {
            accessToken: response.access_token,
            accounts: metadata.accounts
          };
          return result;
        })
        .then(setStorage);
    });
}

$(document).ready(function () {
  const linkHandler = Plaid.create({
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