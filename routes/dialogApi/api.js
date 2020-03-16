const express = require("express");
const router = express.Router();
const chatQuery = require("../../chatbot/chatbot");

router.post("/df_text_query", async (req, res, next) => {
  try {
    const responses = await chatQuery.textQuery(
      req.body.text,
      req.body.userID,
      req.body.parameter
    );
    const result = responses[0].queryResult;
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/df_event_query", async (req, res, next) => {
  try {
    const responses = await chatQuery.eventQuery(
      req.body.event,
      req.body.userID,
      req.body.parameter
    );
    const result = responses[0].queryResult;
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
