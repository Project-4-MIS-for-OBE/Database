const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

const verifyAndValidateToken = (token, res) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "ff8e2880ff8b4422a84cd24b0636ec91", (err, user) => {
      if (err) {
        return res.status(401).send({ ok: false, message: "Invalid token" });
      } else {
        resolve(user);
      }
    });
  });
};

router.get("/signout", async (req, res) => {
  console.log(req.cookies);
  res
    .clearCookie("token", { path: "/", domain: "fsd-obe.cpe.eng.cmu.ac.th" })
    .send({ ok: true });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token, res);
    if (!user.cmuitaccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    return res.send(user);
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

const getCMUBasicInfoAsync = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

router.post("/oauth_student", async (req, res) => {
  try {
    //validate authorizationCode
    const authorizationCode = req.query.code;
    if (typeof authorizationCode !== "string")
      return res
        .status(400)
        .json({ ok: false, message: "Invalid authorization code" });

    //get access token
    const response = await axios.post(
      "https://oauth.cmu.ac.th/v1/GetToken.aspx",
      {},
      {
        params: {
          code: authorizationCode,
          redirect_uri: "https://fsd-obe.cpe.eng.cmu.ac.th/cmuOAuthCallback",
          client_id: "zeEdAXQz8z3YV8MthYCWUQfeWWECBpSGpA4rmg8B",
          client_secret: "fyM5DfjHZRn0e4GV8AtRsn8VTwJuevga0aRwckMR",
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (!response)
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get OAuth access token" });
    //get basic info
    const response2 = await getCMUBasicInfoAsync(response.data.access_token);
    if (!response2)
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get cmu basic info" });
    //create session
    const token = jwt.sign(response2, "ff8e2880ff8b4422a84cd24b0636ec91", {
      expiresIn: "7d", // Token will last for one day only
    });
    return res
      .cookie("token", token, {
        maxAge: 3600000 * 24 * 7, // Cookie will last for one day only
        //Set httpOnly to true so that client JavaScript cannot read or modify token
        //And the created token can be read by server side only
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        //force cookie to use HTTPS only in production code
      })
      .send({ ok: true });
  } catch (err) {
    if (!err.response) {
      return res.send({
        ok: false,
        message: "Cannot connect to API Server. Please try again later.",
      });
    } else if (!err.response.data.ok) return err.response.data;
    else return err;
  }
});

module.exports = router;
