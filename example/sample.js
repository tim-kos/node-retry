//source:
//https://www.npmjs.com/package/retry?activeTab=readme


const axios = require("axios");
//TODO: npm install retry
//TODO: change to 'const retry = require('retry');' in the project
const retry = require("../lib/retry");


//5 attepts with an interval of 1000 ms
const retryOptions = {
  retries: 4, factor: 1, minTimeout: 1000, maxTimeout: 1000, randomize: false,
};

function getDataWithRetry(source) {
  const operation = retry.operation(retryOptions);
  operation.attempt(async function (currentAttempt) {
    console.log(currentAttempt);
    try {
      //*** this is the action itself (with which one we want to use retries)
      // axios get call was used as an example
      const response = await axios.get(source);
      //***
      console.log('Succesful operation. Output:', response.status);
    } catch (error) {
      //cancel further attempts on some condition
      if (error.code === "ENOTFOUND") {
        operation.stop();
        console.log('Retries mechanism stopped. Reason:', error.code);
      }
      //make retry on error
      if (operation.retry(error)) {
        return;
      }
      //actions after all retries
      else {
        console.error('All retries completed. Result:', error.code);
      }
    }
  });
}


//successful case
// getDataWithRetry('https://swapi.dev/api/people/1');

//ERR_BAD_REQUEST error case
getDataWithRetry("https://swapi.dev/api/people/0");

//ENOTFOUND error case
// getDataWithRetry("https://sswapi.dev/api/people/1");
