const axios = require("axios");

const baseUrl =
  "https://www.bkcscan.com/api/v2/tokens/0x8c5C748bCF0f06B5EFdEAf8aDAbe1507E25cFcE0/holders";

// TPCX: https://www.bkcscan.com/api/v2/tokens/0x89A587D40be5b1fE8C9d052C0bcda1A48c10fA20/holders
// DadyKim: https://www.bkcscan.com/api/v2/tokens/0x488023dff3f0B063E4c0C2d939d9a10b1AbA72e7/holders
// BitKao: https://www.bkcscan.com/api/v2/tokens/0x1da3D9B03A6eFd3d0b132dD6BDBE494bdB86e298/holders
// close node: https://www.bkcscan.com/api/v2/tokens/0x8c5C748bCF0f06B5EFdEAf8aDAbe1507E25cFcE0/holders

async function queryNextPage(address_hash, items_count, value) {
  let nextPage = await axios({
    method: "get",
    url:
      baseUrl +
      "?address_hash=" +
      address_hash +
      "&items_count=" +
      items_count +
      "&value=" +
      encodeURIComponent(value),
  });
  return nextPage.data;
}

async function cleanHolderData(holderList) {
  let cleanData = [];
  for (i in holderList) {
    const holder = holderList[i];
    const value = holder.value / 10 ** 18;
    const walletAddress = holder.address.hash;
    cleanData.push({ Address: walletAddress, Value: value });
  }
  return cleanData;
}

async function main() {
  let holderList = [];
  let holderTier = [[], [], [], [], [], []]; // Tier index 0:
  let holderValue = [0, 0, 0, 0, 0, 0];
  let holderFirstPage = await axios.get(baseUrl);
  let lastHolderValue =
    holderFirstPage.data.items[holderFirstPage.data.items.length - 1].value /
    10 ** 18;

  // let addressHash = holderFirstPage.data.next_page_params.address_hash;
  // let itemCount = holderFirstPage.data.next_page_params.items_count;
  // let value = holderFirstPage.data.next_page_params.value;
  // console.log(holderFirstPage.data.next_page_params);

  let cleanHolder = await cleanHolderData(holderFirstPage.data.items);
  holderList.push(...cleanHolder);
  // if (lastHolderValue > 1000) {
  //   let cleanHolder = await cleanHolderData(holderFirstPage.data.items);
  //   holderList.push(...cleanHolder);
  // }
  // while (lastHolderValue > 1000) {
  //   let nextPageHolder = await queryNextPage(addressHash, itemCount, value);
  //   let cleanHolder = await cleanHolderData(nextPageHolder.items);
  //   holderList.push(...cleanHolder);

  //   lastHolderValue =
  //     (await nextPageHolder.items[nextPageHolder.items.length - 1].value) /
  //     10 ** 18;
  //   addressHash = nextPageHolder.next_page_params.address_hash;
  //   itemCount = nextPageHolder.next_page_params.items_count;
  //   value = nextPageHolder.next_page_params.value;
  // }
  // console.log(holderList[0].Value);

  for (i in holderList) {
    const holder = holderList[i];
    const value = holder.Value;
    const walletAddress = holder.Address;

    if (value > 500000) {
      holderTier[0].push({ Address: walletAddress, Value: value });
      holderValue[0] += value;
    } else if (value <= 500000 && value > 100000) {
      holderTier[1].push({ Address: walletAddress, Value: value });
      holderValue[1] += value;
    } else if (value <= 100000 && value > 50000) {
      holderTier[2].push({ Address: walletAddress, Value: value });
      holderValue[2] += value;
    } else if (value <= 50000 && value > 10000) {
      holderTier[3].push({ Address: walletAddress, Value: value });
      holderValue[3] += value;
    } else if (value <= 10000 && value > 5000) {
      holderTier[4].push({ Address: walletAddress, Value: value });
      holderValue[4] += value;
    } else if (value <= 5000 && value > 1000) {
      holderTier[5].push({ Address: walletAddress, Value: value });
      holderValue[5] += value;
    }
  }
  console.log(
    `\n Wallet hold > 500,000 BKC-D: ${
      holderTier[0].length
    } address.\n BKC-D amount: ${holderValue[0]}\n Average: ${
      holderValue[0] / holderTier[0].length
    }`
  );
  console.table(holderTier[0]);

  console.log(
    `\n Wallet hold <= 500,000 && > 100,000 BKC-D: ${
      holderTier[1].length
    } address. \n BKC-D amount: ${holderValue[1]} \n Average: ${
      holderValue[1] / holderTier[1].length
    } `
  );
  console.table(holderTier[1]);

  console.log(
    `\n Wallet hold <= 100,000 && > 50,000 BKC-D: ${
      holderTier[2].length
    } address.\n BKC-D amount: ${holderValue[2]}\n Average: ${
      holderValue[2] / holderTier[2].length
    }`
  );
  console.table(holderTier[2]);

  console.log(
    `\n Wallet hold <= 50,000 && > 10,000 BKC-D: ${
      holderTier[3].length
    } address.\n BKC-D amount: ${holderValue[3]}\n Average: ${
      holderValue[3] / holderTier[3].length
    }`
  );
  console.table(holderTier[3]);

  console.log(
    `\n Wallet hold <= 10,000 && > 5,000 BKC-D: ${
      holderTier[4].length
    } address.\n BKC-D amount: ${holderValue[4]}\n Average: ${
      holderValue[4] / holderTier[4].length
    }`
  );
  console.table(holderTier[4]);

  console.log(
    `\n Wallet hold <= 5,000 && > 1,000 BKC-D: ${
      holderTier[5].length
    } address.\n BKC-D amount: ${holderValue[5]}\n Average: ${
      holderValue[5] / holderTier[5].length
    }`
  );
  console.table(holderTier[5]);

  const a =
    holderFirstPage.data.items[0].token.holders -
    holderTier[0].length -
    holderTier[1].length -
    holderTier[2].length -
    holderTier[3].length -
    holderTier[4].length -
    holderTier[5].length;
  const b =
    holderFirstPage.data.items[0].token.total_supply / 10 ** 18 -
    holderValue[0] -
    holderValue[1] -
    holderValue[2] -
    holderValue[3] -
    holderValue[4] -
    holderValue[5];
  // console.log(
  //   `\n Wallet hold <= 1000: ${a} address.\n BKC-D amount: ${b}.\n Average: ${
  //     a / b
  //   }`
  // );

  console.log(
    `\n Wallet hold > 500,000 BKC-D: ${
      holderTier[0].length
    } address.\n BKC-D amount: ${holderValue[0]}\n Average: ${
      holderValue[0] / holderTier[0].length
    }`
  );

  console.log(
    `\n Wallet hold <= 500,000 && > 100,000 BKC-D: ${
      holderTier[1].length
    } address. \n BKC-D amount: ${holderValue[1]}\n Average: ${
      holderValue[1] / holderTier[1].length
    } `
  );

  console.log(
    `\n Wallet hold <= 100,000 && > 50,000 BKC-D: ${
      holderTier[2].length
    } address.\n BKC-D amount: ${holderValue[2]}\n Average: ${
      holderValue[2] / holderTier[2].length
    }`
  );

  console.log(
    `\n Wallet hold <= 50,000 && > 10,000 BKC-D: ${
      holderTier[3].length
    } address.\n BKC-D amount: ${holderValue[3]}\n Average: ${
      holderValue[3] / holderTier[3].length
    }`
  );

  console.log(
    `\n Wallet hold <= 10,000 && > 5,000 BKC-D: ${
      holderTier[4].length
    } address.\n BKC-D amount: ${holderValue[4]}\n Average: ${
      holderValue[4] / holderTier[4].length
    }`
  );

  console.log(
    `\n Wallet hold <= 5,000 && > 1,000 BKC-D: ${
      holderTier[5].length
    } address.\n BKC-D amount: ${holderValue[5]}\n Average: ${
      holderValue[5] / holderTier[5].length
    }`
  );

  console.log(
    `\n Wallet hold <= 1000: ${a} address.\n BKC-D amount: ${b}\n Average: ${
      b / a
    }`
  );

  // console.log(holderFirstPage.data.items[0].token.holders);
  // console.log(holderFirstPage.data.items[0].token.total_supply / 10 ** 18);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
