const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://swalife.com');
  await page.type('#useridField', "e136063");
  await page.type('#swalifeLoginForm > div.loginFields > input:nth-child(7)', "andREW135")
  await page.click('#swalifeLoginForm > div.loginButtons > input')
  await page.goto('https://www14.swalife.com/employee-info')
  await delay(2000)
  await page.click('#tabs > li:nth-child(2)')
  await delay(3000)

  const flight_data = await page.evaluate(() => {
    let flights = []
    const table = document.querySelector("#travelHistory");
    for (let i = 1; i < table.rows.length; i++) {
      if (table.rows[i].cells[0].innerText.includes("/")) {
        flights.push({
          "PNR": table.rows[i - 1].cells[0].innerText,
          "Flight Date": table.rows[i].cells[0].innerText,
          "Flight Number": table.rows[i].cells[1].innerText,
          "Origin": table.rows[i].cells[2].innerText,
          "Destination": table.rows[i].cells[3].innerText,
          "Priority": table.rows[i].cells[4].innerText,
          "Reason": table.rows[i].cells[5].innerText
        })
      } else {
        flights.push({
          "PNR": table.rows[i].cells[0].innerText,
          "Flight Date": table.rows[i].cells[1].innerText,
          "Flight Number": table.rows[i].cells[2].innerText,
          "Origin": table.rows[i].cells[3].innerText,
          "Destination": table.rows[i].cells[4].innerText,
          "Priority": table.rows[i].cells[5].innerText,
          "Reason": table.rows[i].cells[6].innerText
        })
      }
    }
    return flights;
  })

  flight_data.map((flight) => {
    console.log(flight)
  })

  await page.screenshot({ path: 'www14.swalife.png' });
  await browser.close();

  return flight_data;

})();


