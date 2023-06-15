const express = require("express");
const cors = require("cors");

const twilioSID = "ACb03fed2316821f6bedddc5b11001e8d7";

const twilioAuth = "a7b2696545d2a474448f5f9dbad27fb6";
const client = require("twilio")(twilioSID, twilioAuth);

const app = express();
const port = 5000;

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200,
  })
);

app.use(express.urlencoded({ extended: false }));

// *built-in middleware for json
app.use(express.json());

app.get("/", function (req, res) {
  res.send("GET request to homepage");
});

app.post("/power-dailer", async (req, res) => {
  const { phoneList } = req.body;

  const twilioNumber = "+13613227906";

  console.time("timer");
  let calls = [];
  // for (const item of phoneList) {
  //   const call = await client.calls.create({
  //     url: "http://demo.twilio.com/docs/voice.xml",
  //     to: item.phone,
  //     from: twilioNumber,
  //   });
  //   console.log(`call ${item.name}: `, call.sid);
  //   calls.push(call);
  // }

  await Promise.all(
    phoneList.map(async (item) => {
      const call = await client.calls.create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: item.phone,
        from: twilioNumber,
      });
      console.log(`call ${item.name}: `, call.sid);
      calls.push(call);
    })
  );

  res.send({
    message: "call intialed Success",
    data: calls,
    //  callSid: call.sid,
    //  data: call
  });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
