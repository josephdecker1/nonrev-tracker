const functions = require("firebase-functions");
const cors = require("cors")({
  origin: true,
});

const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getUpdatedSwaFlightData = functions
  .runWith({
    timeoutSeconds: 500,
    memory: "2GB"
  })
  .https.onRequest(async (request, response) => {
    if (request.method === "PUT" || request.method === "GET") {
      return response.status(403).send("Forbidden!");
    }

    return cors(request, response, async () => {
      console.info(request.body.username);

      const username = request.body.username;
      const password = request.body.password;
      const lastUpdatedPNR = request.body.pnr;

      const flight_data = await (async () => {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        await page.goto("https://swalife.com");
        await page.type("#useridField", username);
        await page.type(
          "#swalifeLoginForm > div.loginFields > input:nth-child(7)",
          password
        );
        await page.click("#swalifeLoginForm > div.loginButtons > input");
        await page.goto("https://www14.swalife.com/employee-info");
        await delay(2000);
        await page.click("#tabs > li:nth-child(2)");
        await delay(3000);

        const flight_data = await page.evaluate(lastUpdatedPNR => {
          let flights = [];
          let rowNumNewData;
          const table = document.querySelector("#travelHistory");

          // find the last known lastUpdatedPNR
          for (let i = 1; i < table.rows.length; i++) {
            if (table.rows[i].cells[0].innerText == lastUpdatedPNR) {
              rowNumNewData = i;
              break;
            }
          }

          // iterate up to but not including the last known pnr
          for (let i = 1; i < rowNumNewData; i++) {
            if (table.rows[i].cells[0].innerText.includes("/")) {
              flights.push({
                PNR: table.rows[i - 1].cells[0].innerText,
                "Flight Date": table.rows[i].cells[0].innerText,
                "Flight Number": table.rows[i].cells[1].innerText,
                Origin: table.rows[i].cells[2].innerText,
                Destination: table.rows[i].cells[3].innerText,
                Priority: table.rows[i].cells[4].innerText,
                Reason: table.rows[i].cells[5].innerText
              });
            } else {
              flights.push({
                PNR: table.rows[i].cells[0].innerText,
                "Flight Date": table.rows[i].cells[1].innerText,
                "Flight Number": table.rows[i].cells[2].innerText,
                Origin: table.rows[i].cells[3].innerText,
                Destination: table.rows[i].cells[4].innerText,
                Priority: table.rows[i].cells[5].innerText,
                Reason: table.rows[i].cells[6].innerText
              });
            }
          }
          return flights;
        }, lastUpdatedPNR);

        flight_data.map(flight => {
          console.log(flight);
        });
        await browser.close();

        return flight_data;
      })();

      response.send(flight_data);
    });
  });

exports.getSwaFlightData = functions.runWith({
  timeoutSeconds: 500,
  memory: '2GB'
}).https.onRequest(async (request, response) => {
  if (request.method === 'PUT' || request.method === 'GET') {
    return response.status(403).send('Forbidden!');
  }

  return cors(request, response, async () => {

    console.info(request.body.username)

    const username = request.body.username
    const password = request.body.password

    const flight_data = await (async () => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.goto('https://swalife.com');
      await page.type('#useridField', username);
      await page.type('#swalifeLoginForm > div.loginFields > input:nth-child(7)', password)
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
      await browser.close();

      return flight_data;

    })();

    response.send(flight_data)
  })

})
