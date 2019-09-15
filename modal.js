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
    'current': 40,
    'limit': 50,
    'iso_currency_code': 'USD',
    'unofficial_currency_code': null,
  },
  'mask': '3333',
  'name': 'Plaid Credit Card',
  'official_name': 'Plaid Diamond Credit Card',
  'subtype': 'credit card',
  'type': 'credit'
}];

function generateChart(data, labels, id) {
  const [balance, cost] = data;
  const [yLabel, barFragmentLabelLeft, barFragmentLabelRight] = labels;

  // setting values for the bars and bar colors
  let balanceBar = balance - cost;
  let costBar = cost;
  let barFragmentColorLeft, barFragmentColorRight;

  if (balance > cost) {
    [barFragmentColorLeft, barFragmentColorRight] = ['#00FF00', '#98FB98'];
  } else { // overdraft
    [barFragmentColorLeft, barFragmentColorRight] = ['#FF0000', '#FF7F7F'];
  }

  const canvas = document.getElementById(id);
  canvas.width = $(canvas.parentNode).width();
  canvas.height = $(canvas.parentNode).height();

  // generating stacked chart
  return new Chart(canvas, {
    type: 'horizontalBar',
    data: {
      labels: [yLabel],
      datasets: [
        {
          label: barFragmentLabelLeft,
          data: [balanceBar],
          backgroundColor: barFragmentColorLeft
        },
        {
          label: barFragmentLabelRight,
          data: [costBar],
          backgroundColor: barFragmentColorRight
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: false,
      scales: {
        xAxes: [{
          stacked: true,
          barThickness: 'flex',
        }],
        yAxes: [{
          stacked: true,
          barThickness: 'flex',
        }]
      }
    }
  });
}

// Given a list of the bank accounts for the user, the card being used,
// cost of purchase. Returns a list of charts for overall, budget, and
// card balances
// plaidObj = list of accounts, where account is a object containing
//   user bank account information
// card = string of last 4 digits of account's number
// cost = size of pending purchase
function data2Charts(plaidObj, card, cost) {
  let overallBalance = 0;
  let cardBalance = 0;
  let limit = 0;
  let typeCard = 'depository';

  let account;
  for (const i in plaidObj) {
    account = plaidObj[i];

    if (account.type === 'credit') {
      overallBalance -= account.balances.current;
    } else {
      overallBalance += account.balances.current;
    }

    if (card === account.mask) {
      typeCard = account.type;
      limit = account.balances.limit;
      cardBalance += account.balances.current;
    }
  }

  // if typeCard is null, then give an error?
  const overallChart = generateChart([overallBalance, cost], ['Overall', 'Remaining Funds', 'Cost of Purchase'], 'overall-chart');

  // only show card chart if overdraft will occur on that card and not overall
  let cardChart;
  if (typeCard === 'credit' && limit < cardBalance + cost) {
    $('#card-chart').parent().show();
    cardChart = generateChart([limit, cardBalance + cost], ['Card', 'Remaining Funds', 'Cost of Purchase'], 'card-chart');
  } else if (cardBalance < cost) {
    $('#card-chart').parent().show();
    cardChart = generateChart([cardBalance, cost], ['Card', 'Remaining Funds', 'Cost of Purchase'], 'card-chart');
  }

  return [overallChart, cardChart];
}

$(document).ready(() => {
  $('#divine-backdrop').click(() => parent.postMessage({method: 'closeModal'}, '*'));
  data2Charts(exampleUser, '3333', 20);
});