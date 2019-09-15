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
    userLegalName: 'Lujing Cen',
    userEmailAddress: 'lujingcen@gmail.com',
    onSuccess: (publicToken, metadata) => {
      addItem(publicToken, metadata).then(() => getAllAccountsByIns().then(instituteToAccounts => {
        renderAccountsByInstitutes(instituteToAccounts)
      }))
    }
  });

  $('#link').click(function () {
    linkHandler.open();
  });

  getStorage().then(storage => {
    if (storage.items) {
      getAllAccountsByIns().then(instituteToAccounts => renderAccountsByInstitutes(instituteToAccounts))
    }
  })
});

document.addEventListener('click', function (event) {
	if (!event.target.matches('.delete-button')) return;
	event.preventDefault();
  const id = Number(event.target.id)
  getStorage().then(storage => {
    let items = storage.items
    const institution = Object.keys(items)[Number(event.target.id)] 
    delete items[institution]
    storage.items = items
    setStorage(storage)
    document.getElementById(`institution-${id}`).remove()
  })
}, false);

function renderAccountsByInstitutes(instituteToAccounts) {
  // first delete the accounts 
  const institutions = document.getElementById("institutions")
  while (institutions.firstChild) {
    institutions.removeChild(institutions.firstChild)
  }
  console.log("deleted all children of institutions, about to re-render")
  let i = 0 
  // {ins_3: {…}, ins_4: {…}, ins_5: {…}, ins_9: {…}}
  for (institution of Object.keys(instituteToAccounts)) {
    let institutionElem = document.createElement("div")
    institutionElem.id = `institution-${i}`
    institutionElem.className = "list-group" 
    let titleElem = document.createElement("div")
    titleElem.className = "list-group-item"
    titleElem.innerHTML = `
      <div style="display: flex; justify-content: space-between">
        <h4>${institution}</h4>
        <button type="button" id="${i}" class="btn btn-danger pull-right delete-button">Delete</button>
      </div>
    `;
    institutionElem.appendChild(titleElem)
    document.getElementById("institutions").appendChild(institutionElem)
    let accounts = Object.values(instituteToAccounts)[i].accounts
    loadResults(accounts, i)
    i++
  }
}

function loadResults(array, i) {
  array.forEach(account => {      
    let institution =  document.getElementById(`institution-${i}`)
    let item = document.createElement("div")
    item.className = "list-group-item"
    item.innerHTML = `<p>${account.name}</p>`;
    institution.appendChild(item)
  });
}


