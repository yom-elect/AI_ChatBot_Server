const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const { LocalStorage } = require("node-localstorage");
const express = require("express");
const router = express.Router();
const Product = require("./../../models/Products");
const registerTaxpayer = require("../../models/RegisterIndividual");
const {
  validateUser,
  validateUserToken
} = require("../../models/RaiseAssessment");

const localStorage = new LocalStorage("./scratch");

router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", async (req, res, next) => {
  const agent = new WebhookClient({ request: req, response: res });
  const searchProduct = agent => {
    Product.findOne({ product: agent.parameters.products }, (err, product) => {
      if (product !== null) {
        product.counter++;
        product.save();
      } else {
        const product = new Product({ product: agent.parameters.products });
        product.save();
      }
    });
    let responseText = `You want to learn about ${agent.parameters.products}. Here is a link to all our products: http://softalliance.com/`;
    agent.add(responseText);
    agent.add(new Suggestion("tell me more"));
  };
  const validateEmail = async agent => {
    const email = agent.parameters.Username;
    try {
      const feedback = await validateUser(email);
      if (feedback.Success) {
        console.log(feedback.responseDescription);
        let responseText = feedback.responseDescription.slice(0, -5);
        let input = "Please enter your token";
        agent.add(responseText);
        agent.add(input);
      } else {
        let responseText = `Something Went Wrong Please Try again Later`;
        agent.add(responseText);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const validateToken = async agent => {
    const email =
      agent.context.inputContexts.individual_username.parameters.Username;
    const token = agent.parameters.token;
    payload = {
      username: email,
      tokenValue: JSON.stringify(token)
    };
    try {
      const feedback = await validateUserToken(payload);
      if (feedback.Success) {
        await localStorage.setItem("authToken", JSON.stringify(feedback.token));
        console.log(localStorage.getItem("authToken"));
        let responseText =
          "Welcome, Soft Alliance & Resource. What Assessment will you like to file";
        agent.add(responseText);
        agent.add(new Suggestion("Informal"));
        agent.add(new Suggestion("PAYEE"));
      } else {
        let responseText = `Something Went Wrong Please Try again Later`;
        agent.add(responseText);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const registerIndividualTaxPayer = async agent => {
    const fields = agent.parameters;
    const payload = {
      SURNAME: fields.Surname,
      FIRSTNAME: fields.Firstname,
      MIDDLENAME: fields.Middlename,
      DATEOFBIRTH: fields.Birth.slice(0, 10),
      UserName: fields.UserName,
      EMAILADDRESS: fields.Email,
      PHONENO: fields.Phone,
      Password: "SoftAlliance#1",
      ConfirmPassword: "SoftAlliance#1",
      TAXOFFICE: 108
    };
    try {
      const feedback = await registerTaxpayer(
        payload,
        "Individual",
        (auth = true)
      );
      console.log(feedback);
      let responseText = `still waiting for server`;
      agent.add(responseText);
    } catch (err) {
      console.log(err);
    }
  };

  const registerCorporateTaxPayer = async agent => {
    const fields = agent.parameters;
    const payload = {
      CORPORATENAME: fields.CorporateName,
      OFFICEADDRESS: fields.OfficeAddress,
      OFFICEPHONE: fields.OfficePhone,
      EFFECTIVEDATE: fields.EffectiveDate.slice(0, 10),
      RCNUMBER: fields.RcNumber,
      EMAILADDRESS: fields.Email,
      APP_USERID: 45
    };
    try {
      const feedback = await registerTaxpayer(
        payload,
        "Corporate",
        (auth = true)
      );
      console.log(feedback);
      let responseText = `still waiting for server`;
      agent.add(responseText);
    } catch (err) {
      console.log(err);
    }
  };

  const fallback = agent => {
    agent.add("I didnt Understand");
    agent.add("I'm sorry, can you try again");
  };

  let intentMap = new Map();
  intentMap.set("search products", searchProduct);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("individual-registration-details", registerIndividualTaxPayer);
  intentMap.set("corporate-registration-details", registerCorporateTaxPayer);
  intentMap.set("individual-assessment-user", validateEmail);
  intentMap.set("individual-assessment-token", validateToken);
  agent.handleRequest(intentMap);
});

module.exports = router;
