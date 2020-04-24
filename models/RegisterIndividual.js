const axios = require("axios");

const registerTaxPayer = async (payload, type, auth) => {
  try {
    const authenticate = auth; //await authenticateRequest();
    if (authenticate) {
      //const userId = await getUserId();

      let url = "";
      if (type === "Individual") {
        url =
          "http://softtax.softalliance.com/mobile/auth/RegisterIndividualTaxPayer"; //config.url.individualRegister;
      } else {
        url =
          "http://softtax.softalliance.com/mobile/auth/RegisterCorporateTaxPayer"; //config.url.corporateRegister;
        //payload["USERID"] = userId;
      }
      const response = await axios.post(url, payload);

      const resData = response.data;
      return resData;
    } else {
      const resData = false;
      return resData;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = registerTaxPayer;
