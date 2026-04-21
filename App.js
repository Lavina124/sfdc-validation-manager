import React, { useState } from "react";

function App() {
  const [rules, setRules] = useState([]);

  // 🔐 LOGIN
  const login = () => {
  alert("Already connected using access token");
};
  // 📥 GET RULES
  const getValidationRules = async () => {
    try {
      const res = await fetch("http://localhost:5000/rules");
      const data = await res.json();

      console.log("DATA:", data);

      if (Array.isArray(data)) {
        setRules(data);
      } else {
        setRules([]);
        alert(JSON.stringify(data)); // show real error
      }

    } catch (err) {
      console.error(err);
      alert("Error fetching rules");
    }
  };

  // 🔄 TOGGLE RULE
  const toggleRule = async (ruleName, isActive) => {
    try {
      const res = await fetch(
        `http://localhost:5000/toggle?name=${ruleName}&active=${isActive}`
      );

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert("Updated!");

      getValidationRules();

    } catch (err) {
      console.error(err);
      alert("Error updating rule");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Salesforce Validation Rule Manager</h2>

      <button onClick={login}>Login to Salesforce</button>

      <br /><br />

      <button onClick={getValidationRules}>
        Get Validation Rules
      </button>

      <br /><br />

      {Array.isArray(rules) && rules.map((r) => (
        <div key={r.Id} style={{ marginBottom: "10px" }}>
          <b>{r.ValidationName}</b> →{" "}
          {r.Active ? "Active" : "Inactive"}

          <button
            onClick={() =>
              toggleRule(r.ValidationName, r.Active)
            }
            style={{ marginLeft: "10px" }}
          >
            Toggle
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;