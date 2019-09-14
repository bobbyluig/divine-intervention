// TODO(bobbyluig): Switch this to the production endpoint.
var PLAID_ENV = 'sandbox';
var PLAID_ENDPOINT = 'https://sandbox.plaid.com/';

// TODO(bobbyluig): The secret key should not be stored here.
var PLAID_CLIENT_ID = '5d01659c1c640200135de6f6';
var PLAID_PUBLIC_KEY = '9a6fba9148382e6bcc57e8a0f93850';
var PLAID_SECRET_KEY = '683dcc0ab325c92a769e815f50b41a';

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
    onSuccess: function(publicToken, metadata) {
      alert(publicToken);
    }
  });

  $('#link').click(function () {
    linkHandler.open();
  });
});