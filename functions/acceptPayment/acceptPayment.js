const nodemailer = require("nodemailer");
const emailTemplate = require("./emailTemplate");
const clientEmailTemplate = require("./clientEmailTemplate");
var admin = require("firebase-admin");
const TextToSVG = require("text-to-svg");
const fs = require("fs");

const readSvg = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(require.resolve(fileName), (error, data) => {
      resolve(data.toString());
    });
  });
};

const svgCardTemplate = async ({
  provider = "mastercard",
  numberOnFront = true,
  name,
  logoText,
  logoTextSize,
}) => {
  const options = { x: 0, y: 0, fontSize: 4.79, anchor: "top", attributes: { fill: "black" } };

  const textToSVG = TextToSVG.loadSync(require.resolve("./Oswald-Regular.ttf"));
  const namePath = textToSVG.getPath(name, options);
  const fontSize = logoTextSize * 0.19;
  const customTextPath = textToSVG.getPath(logoText, { ...options, fontSize });
  const cardBackNoNumber = await readSvg("./card-back-withoutNR.svg");
  const cardBackWithNumber = await readSvg("./card-back-withNR.svg");

  return {
    front: `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" width="85.6mm" height="53.98mm" viewBox="0 0 85.6 53.98" fill="white">
  <rect x="0" y="0" width="85.6" height="53.98" stroke="black" stroke-width="0.3" rx="3.5"></rect>
  <g id="logoText" transform="translate(2,2)">${customTextPath}</g>
  <g id="lust" transform="translate(8,14)">
      <path d="M11.3059 0.186279H1.93797C1.37339 0.186279 0.91571 0.667514 0.91571 1.26115V6.96913C0.91571 7.56277 1.37339 8.044 1.93797 8.044H11.3059C11.8704 8.044 12.3281 7.56277 12.3281 6.96913V1.26115C12.3281 0.667514 11.8704 0.186279 11.3059 0.186279Z" stroke="black" stroke-width="0.165"/>
  </g>
  <g id="name" transform="translate(5,43)">
     ${namePath}
  </g>
  ${
    provider === "mastercard"
      ? `<g id="provider-mastercard" transform="translate(70,44)">
      <path d="M10.3369 3.67058C10.3369 5.15569 9.12796 6.26401 7.63366 6.26401C7.00247 6.26401 6.59612 6.07239 6.13575 5.71236C6.76523 5.22 7.09549 4.52827 7.09549 3.67058C7.09549 2.81288 6.73653 2.18472 6.10706 1.69236C6.56742 1.33232 7.00013 0.98158 7.63132 0.98158C9.12562 0.98158 10.3369 2.18547 10.3369 3.67058Z" fill="white"/>
      <path d="M2.12246 3.67058C2.12246 2.18546 3.30193 1.08337 4.79623 1.08337C5.42743 1.08337 5.90359 1.32443 6.36395 1.68447C5.73448 2.17683 5.36389 2.81288 5.36389 3.67058C5.36389 4.52827 5.68895 5.17397 6.31842 5.66633C5.85806 6.02637 5.3854 6.24974 4.7542 6.24974C3.2599 6.24974 2.12246 5.15569 2.12246 3.67058Z" fill="white"/>
      <path d="M5.19562 3.67062C5.19562 2.81293 5.59973 2.04892 6.22904 1.55656C5.76885 1.19652 5.18805 0.981625 4.55686 0.981625C3.06256 0.981625 1.85126 2.18551 1.85126 3.67062C1.85126 5.15573 3.06256 6.35962 4.55686 6.35962C5.18805 6.35962 5.76885 6.14473 6.22904 5.78469C5.59973 5.29233 5.19562 4.52832 5.19562 3.67062Z" fill="#282828"/>
      <path d="M10.6045 3.67062C10.6045 5.15573 9.39315 6.35962 7.89886 6.35962C7.26766 6.35962 6.68687 6.14473 6.2265 5.78469C6.85598 5.29233 7.26009 4.52832 7.26009 3.67062C7.26009 2.81293 6.85598 2.04892 6.2265 1.55656C6.68687 1.19652 7.26766 0.981625 7.89886 0.981625C9.39315 0.981625 10.6045 2.18551 10.6045 3.67062Z" fill="#282828"/>
      <path d="M6.23287 1.69598C5.03566 2.65485 4.91914 4.59863 6.22513 5.64527C7.42234 4.6864 7.53885 2.74262 6.23287 1.69598Z" fill="#282828"/>
</g>`
      : provider === "visa"
      ? `<g id="provider-visa" transform="translate(70,45)">
<rect width="10.4983" height="5.378" fill="white"/>
<path d="M4.55527 4.22687H3.71069L4.23895 1.16101H5.08349L4.55527 4.22687Z" fill="black"/>
<path d="M7.61688 1.23596C7.45029 1.17393 7.18607 1.10544 6.85936 1.10544C6.02531 1.10544 5.43798 1.5229 5.43438 2.11973C5.42745 2.56008 5.85489 2.80466 6.17458 2.95149C6.50134 3.10152 6.61241 3.19945 6.61241 3.33318C6.60909 3.53857 6.34837 3.63325 6.10521 3.63325C5.76802 3.63325 5.58734 3.58443 5.31277 3.47016L5.20156 3.42118L5.08337 4.1094C5.28146 4.19411 5.64641 4.26927 6.02531 4.27257C6.9115 4.27257 7.48844 3.86157 7.49528 3.22554C7.49865 2.87653 7.27294 2.60911 6.78634 2.39058C6.49095 2.2503 6.31004 2.15571 6.31004 2.01218C6.3135 1.8817 6.46305 1.74805 6.7965 1.74805C7.07107 1.74151 7.27281 1.80346 7.42563 1.86545L7.50202 1.898L7.61688 1.23596V1.23596V1.23596Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.12869 1.16101H9.78197L10.4633 4.22683H9.68133C9.68133 4.22683 9.60481 3.87457 9.58056 3.76693H8.49619L8.31893 4.22683H7.43274L8.68725 1.41539C8.77417 1.21641 8.92723 1.16101 9.12869 1.16101ZM9.07669 2.28293C9.07669 2.28293 8.80905 2.9646 8.7395 3.14073H9.44151C9.40677 2.98745 9.24684 2.25358 9.24684 2.25358L9.18781 1.98941C9.16296 2.05743 9.12701 2.15095 9.10277 2.21403C9.08633 2.2568 9.07527 2.28557 9.07669 2.28293Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.17815 3.25164L3.00527 1.16101H3.89834L2.57081 4.22362H1.67769L0.925072 1.56021C0.665309 1.41764 0.368835 1.30299 0.0373535 1.22342L0.0512551 1.16148H1.4101C1.59429 1.16794 1.74374 1.22338 1.79237 1.41919L2.0874 2.82646C2.08752 2.82685 2.08764 2.82724 2.08777 2.82763L2.17815 3.25164Z" fill="black"/>
</g>`
      : ""
  }

  ${
    numberOnFront
      ? `<g id="number" transform="translate(27.8, 25)">
  <path d="M1.1297 0.891512H0.203573V0.53301H1.58637V0.75494L0.946184 3.98999H0.506593L1.1297 0.891512ZM2.776 0.891512H1.84987V0.53301H3.23267V0.75494L2.59248 3.98999H2.15289L2.776 0.891512ZM4.4223 0.891512H3.49617V0.53301H4.87897V0.75494L4.23878 3.98999H3.79919L4.4223 0.891512ZM6.0686 0.891512H5.14247V0.53301H6.52526V0.75494L5.88508 3.98999H5.44549L6.0686 0.891512ZM8.69018 0.891512H7.76405V0.53301H9.14684V0.75494L8.50666 3.98999H8.06707L8.69018 0.891512ZM10.3365 0.891512H9.41035V0.53301H10.7931V0.75494L10.153 3.98999H9.71337L10.3365 0.891512ZM11.9828 0.891512H11.0566V0.53301H12.4394V0.75494L11.7993 3.98999H11.3597L11.9828 0.891512ZM13.6291 0.891512H12.7029V0.53301H14.0857V0.75494L13.4456 3.98999H13.006L13.6291 0.891512ZM16.2507 0.891512H15.3245V0.53301H16.7073V0.75494L16.0671 3.98999H15.6275L16.2507 0.891512ZM17.897 0.891512H16.9708V0.53301H18.3536V0.75494L17.7134 3.98999H17.2738L17.897 0.891512ZM19.5433 0.891512H18.6171V0.53301H19.9999V0.75494L19.3597 3.98999H18.9201L19.5433 0.891512ZM21.1896 0.891512H20.2634V0.53301H21.6462V0.75494L21.006 3.98999H20.5664L21.1896 0.891512ZM23.8111 0.891512H22.885V0.53301H24.2678V0.75494L23.6276 3.98999H23.188L23.8111 0.891512ZM25.4574 0.891512H24.5313V0.53301H25.9141V0.75494L25.2739 3.98999H24.8343L25.4574 0.891512ZM27.1037 0.891512H26.1776V0.53301H27.5604V0.75494L26.9202 3.98999H26.4806L27.1037 0.891512ZM28.75 0.891512H27.8239V0.53301H29.2067V0.75494L28.5665 3.98999H28.1269L28.75 0.891512Z" fill="#282828"/>
</g>
<g id="validity" transform="translate(37.3, 31)">
  <path d="M0.758878 0.0238772H1.02258L1.34101 1.50905L1.64451 0.0238772H1.90075L1.45544 2.03894H1.20916L0.758878 0.0238772ZM2.33616 2.05884C2.28143 2.05884 2.23167 2.04309 2.18689 2.01158C2.14377 1.98006 2.10977 1.9386 2.0849 1.88719C2.06002 1.83578 2.04758 1.78187 2.04758 1.72549C2.04758 1.61271 2.07163 1.52149 2.11973 1.45184C2.16782 1.38052 2.22919 1.32413 2.30382 1.28267C2.37845 1.24121 2.48211 1.19394 2.61478 1.14087V1.03887C2.61478 0.944338 2.60483 0.877999 2.58493 0.839853C2.56669 0.80005 2.52854 0.780148 2.4705 0.780148C2.36933 0.780148 2.31874 0.848146 2.31874 0.984142V1.05629L2.05504 1.04634C2.05836 0.88712 2.09485 0.770197 2.1645 0.695565C2.23416 0.619275 2.34196 0.581129 2.48791 0.581129C2.62556 0.581129 2.72507 0.619275 2.78644 0.695565C2.84946 0.770197 2.88097 0.883803 2.88097 1.03638V1.69315C2.88097 1.80095 2.88926 1.91621 2.90585 2.03894H2.66205C2.64381 1.94441 2.6322 1.87392 2.62722 1.82748C2.60732 1.89216 2.57249 1.94689 2.52274 1.99167C2.47464 2.03645 2.41245 2.05884 2.33616 2.05884ZM2.44064 1.82997C2.47547 1.82997 2.50947 1.8167 2.54264 1.79017C2.57581 1.76197 2.59986 1.73544 2.61478 1.71056V1.30257C2.54347 1.34238 2.48791 1.3772 2.44811 1.40706C2.40996 1.43525 2.37762 1.46842 2.35108 1.50657C2.32621 1.54471 2.31377 1.59032 2.31377 1.64339C2.31377 1.7031 2.32455 1.74953 2.34611 1.7827C2.36767 1.81422 2.39918 1.82997 2.44064 1.82997ZM3.16154 0.0238772H3.42773V2.03894H3.16154V0.0238772ZM3.72256 0.10846H3.98875V0.387086H3.72256V0.10846ZM3.72256 0.601031H3.98875V2.03894H3.72256V0.601031ZM4.60699 2.05884C4.48261 2.05884 4.39139 2.01406 4.33334 1.9245C4.27529 1.83329 4.24627 1.68319 4.24627 1.47423V1.1956C4.24627 1.00487 4.27115 0.85478 4.3209 0.74532C4.37232 0.635859 4.46519 0.581129 4.59953 0.581129C4.68411 0.581129 4.76372 0.618445 4.83835 0.693077V0.0238772H5.10454V2.03894H4.83835V1.94689C4.76869 2.02153 4.69157 2.05884 4.60699 2.05884ZM4.67416 1.84987C4.72723 1.84987 4.78196 1.83163 4.83835 1.79514V0.852292C4.77699 0.81083 4.7206 0.790099 4.66918 0.790099C4.5647 0.790099 4.51246 0.890437 4.51246 1.09111V1.49661C4.51246 1.61271 4.52324 1.70061 4.5448 1.76031C4.56636 1.82002 4.60948 1.84987 4.67416 1.84987ZM6.40288 0.232847H5.86304V0.0238772H6.66907V0.153239L6.29591 2.03894H6.03967L6.40288 0.232847ZM7.3625 0.232847H6.82267V0.0238772H7.62869V0.153239L7.25553 2.03894H6.9993L7.3625 0.232847ZM8.34203 0.0238772H8.57339L8.02858 2.03894H7.7997L8.34203 0.0238772ZM9.24045 0.232847H8.70061V0.0238772H9.50664V0.153239L9.13348 2.03894H8.87724L9.24045 0.232847ZM10.2001 0.232847H9.66024V0.0238772H10.4663V0.153239L10.0931 2.03894H9.83687L10.2001 0.232847Z" fill="#282828"/>
</g>`
      : ""
  }
</svg>`,
    back: numberOnFront ? cardBackNoNumber : cardBackWithNumber,
  };
};

const firebaseConfig = {
  "type": process.env["firebase_type"],
  "project_id": process.env["firebase_project_id"],
  "private_key_id": process.env["firebase_private_key_id"],
  "private_key": process.env["firebase_private_key"],
  "client_email": process.env["firebase_client_email"],
  "client_id": process.env["firebase_client_id"],
  "auth_uri": process.env["firebase_auth_uri"],
  "token_uri": process.env["firebase_token_uri"],
  "auth_provider_x509_cert_url": process.env["firebase_auth_provider_x509_cert_url"],
  "client_x509_cert_url": process.env["firebase_client_x509_cert_url"]
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: "https://ucardelite-a9084-default-rtdb.firebaseio.com",
  });
}
const database = admin.database();

const sendEmail = async (data, receiver) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { front, back } = await svgCardTemplate({
    provider: data.provider || "visa",
    numberOnFront: typeof data.numberOnFront === "boolean" ? data.numberOnFront : true,
    name: data.name ? data.name.toUpperCase() : "YOUR FULL NAME",
    logoText: data.logoText || "",
    logoTextSize: data.logoTextSize || 18,
  });

  const response = await transporter.sendMail({
    from: process.env.EMAIL,
    to: receiver === "admin" ? "sojusesu@gmail.com" : data.email_address,
    subject:
      receiver === "admin"
        ? `New order from uCard Elite customer`
        : `Thank you for your order! - uCard Elite team`,
    html: emailTemplate(data, receiver),
    attachments: [
      { filename: "card-front.svg", content: front },
      { filename: "card-back.svg", content: back },
    ],
  });

  return response;
};

const handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTION",
  };

  try {
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (er) {
      //when receiving request from payfast after payment
      body = event.body
        .split("&")
        .reduce((a, b) => ({ ...a, [b.split("=")[0]]: b.split("=")[1] }), {});
    }

    await (() => {
      return new Promise((resolve, reject) => {
        switch (body.payment_status) {
          case "CANCELLED":
            database
              .ref()
              .update({ [body.m_payment_id]: null })
              .then(() => resolve(true));
            break;
          case "COMPLETE":
            database
              .ref("orders/" + body.m_payment_id)
              .once("value")
              .then(async (snap) => {
                if (snap) {
                  const order = snap.val();
                  const re1 = await sendEmail(order, "admin");
                  const res2 = await sendEmail(order, "client");
                  resolve(true);
                }
              })
              .catch((er) => {
                console.log(er);
                resolve(true);
              });
            break;
          default:
            resolve(true);
        }
      });
    })();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ error: error }) };
  }
};

module.exports = { handler };
