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
  const folderPath = "./src/queryImageS3/download-logo/";

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  let projectData = await axios.get(
    "https://developers.bitkubchain.com/api/v2/service/app-directory/page?page=1&limit=100"
  );
  console.log(projectData.data.data.length);
  for (i in projectData.data.data) {
    const imageURL = projectData.data.data[i].image;
    const imageName = `image_${i}${path.extname(imageURL)}`;
    const imagePath = path.join(folderPath, imageName);
    try {
      await downloadImage(imageURL, imagePath);
      // console.log(`Image ${imageName} downloaded successfully!`);
    } catch (error) {
      // console.error(`Error downloading image ${imageName}:`, error);
    }
    console.log(
      `${projectData.data.data[i].name} : ${projectData.data.data[i].image}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
