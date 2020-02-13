const config = {
  googleProjectID: process.env.GOOGLE_PROJECT_ID,
  dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_LANGUAGE_CODE,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: JSON.parse(process.env.GOOGLE_PRIVATE_KEYS)
};

module.exports = config;
