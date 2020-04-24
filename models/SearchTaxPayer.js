const axios = require("axios");

const searchTaxPayer = async (payload, type, auth) => {
  let Uri = "";
  if (type == "individual") {
    Uri = "http://softtax.softalliance.com/mobile/SearchIndividualCustomer";
  } else {
    Uri = "http://softtax.softalliance.com/mobile/SearchCorporateCustomer";
  }
  try {
    const response = await axios.post(Uri, payload, {
      headers: {
        Authorization: "Bearer " + JSON.parse(auth),
      },
    });
    const resData = response.data;
    return resData;
  } catch (err) {
    console.log(err);
  }
};

module.exports = searchTaxPayer;
