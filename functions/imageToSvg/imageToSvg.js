const ImageTracer = require("imagetracerjs");
const { Image, createCanvas } = require("canvas");

const removeBackground = (data) => {
  let ar = [0, 1, 2];
  for (let i = 0; i < data.length; i += 4) {
    if (ar.filter((x) => data[i + x] > 220).length === 3) {
      data[i + 3] = 0;
    } else {
      data[i] = 209;
      data[i + 1] = 209;
      data[i + 2] = 209;
    }
  }
};

module.exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTION",
  };
  try {
    const body = JSON.parse(event.body);

    let { svg, width, height } = await (() => {
      return new Promise((resolve, reject) => {
        const { imageUrl } = body;

        const img = new Image();

        img.onload = () => {
          const canvas = createCanvas(500, 500);
          const aspectRatio = img.width / img.height;
          const newWidth = 2000;
          const newHeight = newWidth / aspectRatio;
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);
          let imageData = ctx.getImageData(0, 0, newWidth, newHeight);
          removeBackground(imageData.data);
          const svg = ImageTracer.imagedataToSVG(imageData, "sharp");
          resolve({ svg, width: newWidth, height: newHeight });
        };

        img.src = imageUrl;
      });
    })();

    return { statusCode: 200, body: JSON.stringify({ svg, width, height }), headers };
  } catch (er) {
    console.log(er);
    return {
      statusCode: 200,
      body: JSON.stringify({ error: er.message }),
      headers,
    };
  }
};
