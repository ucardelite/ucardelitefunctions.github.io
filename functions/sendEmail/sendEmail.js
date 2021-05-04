const nodemailer = require("nodemailer");

const handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTION",
  };
  try {
    const body = JSON.parse(event.body);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: "orders@ucardelite.com",
      subject: `uCard Elite user(${body.email}) message`,
      html: body.message,
    });

    if (!response.error) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return { statusCode: 200, headers, body: JSON.stringify({ error: true }) };
    }
  } catch (error) {
    return { statusCode: 200, headers, body: JSON.stringify({ error: error.toString() }) };
  }
};

module.exports = { handler };
