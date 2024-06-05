const axios = require("axios");

const baseUrl =
  "https://www.bkcscan.com/api/v2/tokens/0x89A587D40be5b1fE8C9d052C0bcda1A48c10fA20/holders";

async function queryNextPage(address_hash, items_count, value) {
  let nextPage = await axios({
    method: "get",
    url:
      baseUrl +
      "?address_hash=" +
      "0x069810a364f9a456b3545ad7c8225a15e6ab7268" +
      "&items_count=" +
      "50" +
      "&value=" +
      encodeURIComponent(value),
  });
  return nextPage;
}

// async function cleanHolderData(holderList) {
//   let cleanData = [];
//   for (i in holderList) {
//     const holder = holderList[i];
//     const value = holder.value / 10 ** 18;
//     const walletAddress = holder.address.hash;
//     cleanData.push({ Address: walletAddress, Value: value });
//   }
//   return cleanData;
// }

async function main() {
  let holderFirstPage = await axios.get(baseUrl);
  console.log(holderFirstPage.data.next_page_params);

  let addressHash = holderFirstPage.data.next_page_params.address_hash;
  let itemCount = holderFirstPage.data.next_page_params.items_count;
  let value = holderFirstPage.data.next_page_params.value;

  let nextPageHolder = await queryNextPage(addressHash, itemCount, value);
  console.log(nextPageHolder.data);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
