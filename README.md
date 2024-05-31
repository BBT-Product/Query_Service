# Query_Service

- This project is use to query Megaland trade volumn

# How to setup

- Clone this repository
- Run `npm i` in terminal

# How to use

- For query KUSDT holder run `npm run start:kusdt` in terminal

  - Tier1 holds >= 10,000 KUSDT
  - Tier2 holds < 10,000 && >= 5,000 KUSDT
  - Tier3 holds < 5,000 && >= 1,000 KUSDT

- For query Megaland trade volumn run `npm run start:mega {Number of past day that want to query}` in terminal

- For query S3 image data
  - query logo run `npm run start:s3-logo` in terminal
  - query screenshot rin `npm run start:s3-screenshot` in terminal
