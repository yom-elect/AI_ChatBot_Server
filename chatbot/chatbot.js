const dialogflow = require("dialogflow");
const structjson = require("./structjson");
const uuid = require("uuid");

const config = require("../config/keys");
const sessionId = uuid.v4();
const projectID = config.googleProjectID;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
};
const Registration = require("../models/Registration");
const registerIndividual = require("../models/RegisterIndividual");

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });

const chatQuery = {
  textQuery: async (text, userID, parameters = {}) => {
    let sessionPath = sessionClient.sessionPath(
      config.googleProjectID,
      sessionId + userID
    );
    let self = chatQuery;
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: text,
          // The language used by the client (en-US)
          languageCode: config.dialogFlowSessionLanguageCode
        }
      },
      queryParams: {
        payload: {
          data: parameters
        }
      }
    };
    // Send request and log result
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },
  eventQuery: async (event, userID, parameters = {}) => {
    let sessionPath = sessionClient.sessionPath(
      config.googleProjectID,
      sessionId + userID
    );
    let self = chatQuery;
    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          // The query to send to the dialogflow agent
          name: event,
          parameters: structjson.jsonToStructProto(parameters),
          // The language used by the client (en-US)
          languageCode: config.dialogFlowSessionLanguageCode
        }
      }
    };
    // Send request and log result
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },
  handleAction: responses => {
    let self = chatQuery;
    let queryResult = responses[0].queryResult;

    switch (queryResult.action) {
      case "recommendproducts-yes":
        if (queryResult.allRequiredParamsPresent) {
          self.saveRegistration(queryResult.parameters.fields);
        }
        break;
      // case "individual_details":
      //   if (queryResult.allRequiredParamsPresent) {
      //     self.registerIndividualTaxPayer(queryResult.parameters.fields);
      //   }
      //   break;
    }
    return responses;
  },

  saveRegistration: async fields => {
    const registration = new Registration({
      name: fields.name.stringValue,
      address: fields.address.stringValue,
      phone: fields.phone.stringValue,
      email: fields.email.stringValue,
      dateSent: Date.now()
    });
    try {
      let reg = await registration.save();
      console.log(reg);
    } catch (err) {
      console.log(err);
    }
  }

  // registerIndividualTaxPayer: async fields => {
  //   const payload = {
  //     SURNAME: fields.Surname.stringValue,
  //     FIRSTNAME: fields.Surname.stringValue,
  //     MIDDLENAME: fields.Surname.stringValue,
  //     DATEOFBIRTH: fields.Surname.stringValue,
  //     UserName: fields.Surname.stringValue,
  //     EMAILADDRESS: fields.Surname.stringValue,
  //     PHONENO: fields.Surname.stringValue
  //   };
  //   try {
  //     const feedback = await registerIndividual(
  //       payload,
  //       "Individual",
  //       (auth = true)
  //     );
  //     console.log(feedback);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
};

module.exports = chatQuery;
