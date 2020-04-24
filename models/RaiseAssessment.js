const axios = require("axios");

const validateUser = async (username) => {
  try {
    url = "http://softtax.softalliance.com/api/AuthToken/createToken";
    const response = await axios.post(url, { username: username });
    const resData = response.data;
    console.log(username, resData);
    return resData;
  } catch (err) {
    console.log(err);
  }
};
const validateUserToken = async (payload) => {
  try {
    url = "http://softtax.softalliance.com/api/AuthToken/validateToken";
    const response = await axios.post(url, payload);
    const resData = response.data;
    return resData;
  } catch (err) {
    console.log(err);
  }
};

exports.validateUser = validateUser;
exports.validateUserToken = validateUserToken;
