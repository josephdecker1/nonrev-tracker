const puppeteer = require("puppeteer");
const prompt = require("prompt");

const delay = ms => new Promise(res => setTimeout(res, ms));

const getflights = async (eid, pw, pnr) => {
  console.log(eid, pnr)
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--auto-open-devtools-for-tabs"
    ]
  });
  const page = await browser.newPage();
  await page.goto("https://swalife.com");

  await page.type("#useridField", eid);
  await page.type(
    "#swalifeLoginForm > div.loginFields > input:nth-child(7)",
    pw
  );
  await page.click("#swalifeLoginForm > div.loginButtons > input");
  await page.goto("https://www14.swalife.com/employee-info");
  await delay(2000);
  await page.click("#tabs > li:nth-child(2)");
  await delay(3000);

  const flight_data = await page.evaluate(pnr => {
    let flights = [];
    let rowNumNewData;
    const table = document.querySelector("#travelHistory");
    console.log("DOING ALL THE THINGS! " + pnr);

    for (let i = 1; i < table.rows.length; i++) {
      console.log("TABLE ROW " + i);
      if (table.rows[i].cells[0].innerText == pnr) {
        // check to see if there is more than one leg in the pnr
        rowNumNewData = i;
        break;
      }
    }

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
  }, pnr);

  flight_data.map(flight => {
    console.log(flight);
  });

  await page.screenshot({ path: "www14.swalife.png" });
  await delay(60);
  // await browser.close();

  return flight_data;
};


let eid, pw, pnr;
prompt.start();
prompt.get(
  [
    {
      name: "username",
      required: true
    },
    {
      name: "password",
      hidden: true,
      conform: function(value) {
        return true;
      }
    },
    {
      name: "lastFlownPNR",
      required: true
    }
  ],
  function(err, result) {
    eid = result.username;
    pw = result.password;
    pnr = result.lastFlownPNR;
    getflights(eid, pw, pnr);
  }
);
