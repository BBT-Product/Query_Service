const axios = require("axios");
const fs = require("fs");
const path = require("path");

const downloadImage = async (url, imagePath) => {
  const writer = fs.createWriteStream(imagePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

async function main() {
  const folderPath = "./src/queryImageS3/download-screenshot/";
  let counter = 1;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  const projectListData = await axios.get(
    "https://developers.bitkubchain.com/api/v2/service/app-directory/page?page=1&limit=100"
  );
  console.log(projectListData.data.data[0].id);

  for (i in projectListData.data.data) {
    const projectDetail = await axios.get(
      `https://developers.bitkubchain.com/api/v2/service/app-directory/${projectListData.data.data[i].id}`
    );
    for (j in projectDetail.data.images) {
      const imageURL = projectDetail.data.images[j];
      const imageName = `image_${counter}${path.extname(imageURL)}`;
      const imagePath = path.join(folderPath, imageName);
      try {
        await downloadImage(imageURL, imagePath);
        console.log(`Image ${imageName} downloaded successfully!`);
      } catch (error) {
        console.error(`Error downloading image ${imageName}:`, error);
      }
      counter++;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
