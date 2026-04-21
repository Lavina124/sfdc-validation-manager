const express = require("express");
const jsforce = require("jsforce");
const cors = require("cors");

const app = express();
app.use(cors());

const conn = new jsforce.Connection({
  accessToken: "your_access_token",
  instanceUrl: "https://orgfarm-c433a1d6cc-dev-ed.develop.my.salesforce.com"
});



// 📥 GET VALIDATION RULES
app.get("/rules", async (req, res) => {
  try {
    if (!conn.accessToken) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const result = await conn.tooling.query(
      "SELECT Id, ValidationName, Active FROM ValidationRule"
    );

    console.log("RULES:", result.records);

    res.json(result.records);

  } catch (err) {
    console.error("RULE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔄 TOGGLE RULE
app.get("/toggle", async (req, res) => {
  const { name, active } = req.query;

  try {
    if (!conn.accessToken) {
      return res.status(401).json({ error: "Not logged in" });
    }

    await conn.metadata.update("ValidationRule", [
      {
        fullName: `Account.${name}`,
        active: active === "true" ? false : true,
      },
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error("TOGGLE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));