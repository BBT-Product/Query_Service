const { BBT_address, Identify_address } = require("./identifyAddress");
const axios = require("axios");

async function main() {
  let tier1 = []; // >= 10000 KUSDT
  let tier2 = []; // < 10000 && >= 5000 KUSDT
  let tier3 = []; // < 5000 && > 1000 KUSDT
  let tier1Value = 0;
  let tier2Value = 0;
  let tier3Value = 0;

  let holderList = [];
  let holdersA = await axios.get(
    "https://www.bkcscan.com/api/v2/tokens/0x7d984C24d2499D840eB3b7016077164e15E5faA6/holders"
  );
  let holdersB = await axios.get(
    "https://www.bkcscan.com/api/v2/tokens/0x7d984C24d2499D840eB3b7016077164e15E5faA6/holders?address_hash=0x4ed82f426f0b726635dfef92dc39e30315baa110&items_count=50&value=1.31179e%2B21"
  );
  holderList = [...holdersA.data.items, ...holdersB.data.items];

  for (i in holderList) {
    const holder = holderList[i];
    const value = holder.value / 10 ** 18;
    const walletAddress = holder.address.hash;
    if (
      !BBT_address.includes(walletAddress) &&
      !Identify_address.includes(walletAddress)
    ) {
      if (value >= 10000) {
        tier1.push({ Address: walletAddress, Value: value });
        tier1Value += value;
      } else if (value < 10000 && value >= 5000) {
        tier2.push({ Address: walletAddress, Value: value });
        tier2Value += value;
      } else if (value < 5000 && value >= 1000) {
        tier3.push({ Address: walletAddress, Value: value });
        tier3Value += value;
      }
    }
  }
  console.log(
    `\n Wallet hold >= 10,000 KUSDT: ${tier1.length} wallets, ${tier1Value} KUSDT`
  );
  console.table(tier1);
  console.log(
    `\n\n Wallet hold < 10,000 KUSDT && >= 5,000 : ${tier2.length} wallets, ${tier2Value} KUSDT`
  );
  console.table(tier2);
  console.log(
    `\n\n Wallet hold < 5,000 KUSDT && >= 1,000 : ${tier3.length} wallets, ${tier3Value} KUSDT`
  );
  console.table(tier3);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
