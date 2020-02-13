const express = require("express");
const router = express.Router();
const chatQuery = require("../../chatbot/chatbot");

router.post("/df_text_query", async (req, res, next) => {
  const responses = await chatQuery.textQuey(req.body.text, req.body.parameter);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  res.send(result);
});

router.post("/df_event_query", async (req, res, next) => {
  const responses = await chatQuery.eventQuey(
    req.body.event,
    req.body.parameter
  );
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  res.send(result);
});

module.exports = router;
