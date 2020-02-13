const dialogflow = require("dialogflow");
const structjson = require("./structjson");
const uuid = require("uuid");

const config = require("../config/keys");
const sessionId = uuid.v4();
const projectID = config.googleProjectID;

const credentials = {
  client_email: config.googleClientEmail,
  private_Key: config.googlePrivateKey
};

const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });
const sessionPath = sessionClient.sessionPath(
  config.googleProjectID,
  sessionId
);

const chatQuery = {
  textQuery: async (text, parameters = {}) => {
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
  eventQuery: async (event, parameters = {}) => {
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
    return responses;
  }
};

module.exports = chatQuery;
