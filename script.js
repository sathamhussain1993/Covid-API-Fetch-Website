// Fetch data from API
fetch('https://data.covid19india.org/v4/min/timeseries.min.json')
  .then(response => response.json())
  .then(data => {
    const timeseries = data['MH']['dates'];
    const totalConfirmed = calculateTotalCases(timeseries, 'confirmed');
    const totalRecovered = calculateTotalCases(timeseries, 'recovered');
    const totalDeceased = calculateTotalCases(timeseries, 'deceased');

    document.getElementById('totalConfirmedValue').textContent = totalConfirmed;
    document.getElementById('totalRecoveredValue').textContent = totalRecovered;
    document.getElementById('totalDeceasedValue').textContent = totalDeceased;

    Object.entries(timeseries).forEach(([date, info], index) => {
      if (date >= '2020-03-26' && date <= '2021-10-31') {
        createCard(date, info, index);
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Function to calculate total cases
function calculateTotalCases(data, type) {
  let total = 0;
  Object.values(data).forEach(info => {
    total += info['delta'][type] || 0;
  });
  return total;
}

// Function to create a card for each date
function createCard(date, info, index) {
  const cardContainer = document.getElementById('cardContainer');
  const card = document.createElement('div');
  card.classList.add('card', 'col-md-4', 'mb-4', 'curved-card', `color-${index % 6 + 1}`);
  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${date}</h5>
      <p class="card-text">Confirmed: ${info['delta']['confirmed']}</p>
      <p class="card-text">Recovered: ${info['delta']['recovered']}</p>
      <p class="card-text">Deceased: ${info['delta']['deceased']}</p>
    </div>
  `;
  cardContainer.appendChild(card);
}

// Function to search for a specific date
function searchData() {
  const searchInput = document.getElementById('searchInput');
  const dateToSearch = searchInput.value.trim();

  if (dateToSearch) {
    const cards = document.getElementsByClassName('card');
    let cardFound = false;
    Array.from(cards).forEach(card => {
      const cardTitle = card.querySelector('.card-title').innerText;
      if (cardTitle.includes(dateToSearch)) {
        card.style.display = 'block';
        cardFound = true;
      } else {
        card.style.display = 'none';
      }
    });
    if (!cardFound) {
      // Display a message or handle no results found case
    }
  } else {
    const cards = document.getElementsByClassName('card');
    Array.from(cards).forEach(card => {
      card.style.display = 'block';
    });
  }
}
