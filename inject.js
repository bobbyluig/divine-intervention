exampleUser = [{
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "balances": {
      "available": 200,
      "current": 200,
      "limit": null,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Checking",
    "subtype": "checking",
    "type": "depository",
    "verification_status": null
  }, {
    "account_id": "6Myq63K1KDSe3lBwp7K1fnEbNGLV4nSxalVdW",
    "balances": {
      "available": null,
      "current": 20,
      "limit": 50,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
    },
    "mask": "3333",
    "name": "Plaid Credit Card",
    "official_name": "Plaid Diamond Credit Card",
    "subtype": "credit card",
    "type": "credit"
  }]

  // Returns a stacked horizontal bar chart of one element
// data = [balance, cost]
//  balance = current balance of the card (i.e. available funds) in $USD
//  cost = size of pending purchase
// labels = [yLabel, barFragmentLabelRight, barFragmentLabelLeft]
function generateChart(data, labels){
    const [balance, cost] = data;
    const [yLabel, barFragmentLabelLeft, barFragmentLabelRight]  = labels;

    // setting values for the bars and bar colors
    let balanceBar = balance - cost
    let costBar = cost
    let barFragmentColorLeft, barFragmentColorRight;

    if (balance > cost) {
        [barFragmentColorLeft, barFragmentColorRight]  = ['#00FF00', '#98FB98'];
    } else { // overdraft
        [barFragmentColorLeft, barFragmentColorRight] = ['#FF0000', '#FF7F7F'];
    };

    // creating DOM element
    var c = document.createElement("canvas")
    c.id = "chart"
    document.body.appendChild(c)

    // generating stacked chart
    return new Chart(c, {
        type: 'horizontalBar',
        data: {
            labels:[yLabel],
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
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
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
    let typeCard = "depository";

    for (var i in plaidObj){
        account = plaidObj[i];

        if (account.type === "credit") {
            overallBalance -= account.balances.current;
        } else {
            overallBalance += account.balances.current;
        }

        if (card === account.mask) {
            typeCard = account.type;
            limit = account.balances.limit;
            cardBalance += account.balances.current;
        };
    }

    // if typeCard is null, then give an error?
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

function showModal() {
  const div = document.createElement('div');
  const shadowRoot = div.attachShadow({mode: 'open'});
  fetch(chrome.runtime.getURL('modal.html')).then(html => {
    html.text().then(text => {
      shadowRoot.innerHTML = text;
      loadCSS(shadowRoot, 'lib/css/bootstrap.min.css');
      loadCSS(shadowRoot, 'modal.css');
      document.body.appendChild(div);

      $('#divine-backdrop', shadowRoot).click(() => $(div).remove());
    });
  });
}

if (isCheckoutPage()) {
  showModal();
}

// charts = data2Charts(exampleUser, "0000", 2000)
charts = data2Charts(exampleUser, "3333", 20)