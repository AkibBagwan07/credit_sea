
const express = require("express");
const multer = require("multer");
const xml2js = require("xml2js");
const fs = require("fs");
const CreditReport = require("../models/Schema");

const router = express.Router();

// ✅ Configure Multer (Make sure the "uploads" folder exists)
const upload = multer({ dest: "uploads/" });

// ✅ Upload & Process XML File
router.post("/", upload.single("xmlFile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  console.log("File received:", req.file);

  const parser = new xml2js.Parser();
  fs.readFile(req.file.path, "utf-8", async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Error reading file" });
    }

    parser.parseString(data, async (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return res.status(500).json({ error: "Error parsing XML" });
      }

      try {
        const extractedData = extractData(result);
        console.log("Extracted Data:", extractedData);

        const newReport = new CreditReport(extractedData);
        const savedReport = await newReport.save();

        res.status(201).json(savedReport); // ✅ Return the saved report

      } catch (error) {
        console.error("❌ Error saving data:", error);
        res.status(500).json({ error: "Error saving data", details: error.message });
      }
    });
  });
});

// ✅ Extract Data from XML (Including Credit Accounts)
function extractData(xmlJson) {
  try {
    const applicant = xmlJson.INProfileResponse.Current_Application[0].Current_Application_Details[0].Current_Applicant_Details[0];
    const summary = xmlJson.INProfileResponse.CAIS_Account[0].CAIS_Summary[0];

    // ✅ Check if CAIS_Account_DETAILS exists
    const accounts = xmlJson.INProfileResponse.CAIS_Account[0].CAIS_Account_DETAILS;
    console.log("Raw Credit Account Data:", JSON.stringify(accounts, null, 2));

    if (!accounts || !Array.isArray(accounts)) {
      console.warn("❌ No credit accounts found or invalid format!");
    }

    return {
      name: `${applicant.First_Name?.[0] || "N/A"} ${applicant.Last_Name?.[0] || "N/A"}`,
      mobile: applicant.MobilePhoneNumber?.[0] || "N/A",
      pan: applicant.IncomeTaxPan?.[0] || "N/A",
      creditScore: xmlJson.INProfileResponse.SCORE?.[0]?.BureauScore?.[0] || "N/A",
      reportSummary: {
        totalAccounts: summary?.Credit_Account?.[0]?.CreditAccountTotal?.[0] || 0,
        activeAccounts: summary?.Credit_Account?.[0]?.CreditAccountActive?.[0] || 0,
        closedAccounts: summary?.Credit_Account?.[0]?.CreditAccountClosed?.[0] || 0,
        currentBalance: summary?.Total_Outstanding_Balance?.[0]?.Outstanding_Balance_All?.[0] || 0,
        securedAmount: summary?.Total_Outstanding_Balance?.[0]?.Outstanding_Balance_Secured?.[0] || 0,
        unsecuredAmount: summary?.Total_Outstanding_Balance?.[0]?.Outstanding_Balance_UnSecured?.[0] || 0,
      },
      creditAccounts: accounts
        ? accounts.map((account, index) => {
            console.log(`Processing Account #${index + 1}`, JSON.stringify(account, null, 2));

            return {
              bankName: account.Subscriber_Name?.[0] || "N/A",
              accountNumber: account.Account_Number?.[0] || "N/A",
              amountOverdue: parseInt(account.Amount_Past_Due?.[0]) || 0,
              currentBalance: parseInt(account.Current_Balance?.[0]) || 0,
              creditLimit: parseInt(account.Credit_Limit_Amount?.[0]) || 0,
              openDate: account.Open_Date?.[0]
                ? new Date(account.Open_Date[0].substring(0, 4) + "-" + account.Open_Date[0].substring(4, 6) + "-" + account.Open_Date[0].substring(6, 8))
                : null,
              address: {
                firstLine: account.CAIS_Holder_Address_Details?.[0]?.First_Line_Of_Address_non_normalized?.[0] || "",
                secondLine: account.CAIS_Holder_Address_Details?.[0]?.Second_Line_Of_Address_non_normalized?.[0] || "",
                city: account.CAIS_Holder_Address_Details?.[0]?.City_non_normalized?.[0] || "",
                state: account.CAIS_Holder_Address_Details?.[0]?.State_non_normalized?.[0] || "",
                zipCode: account.CAIS_Holder_Address_Details?.[0]?.ZIP_Postal_Code_non_normalized?.[0] || "",
                countryCode: account.CAIS_Holder_Address_Details?.[0]?.CountryCode_non_normalized?.[0] || "",
              },
            };
          })
        : [],
    };
  } catch (error) {
    console.error("❌ Error extracting data:", error);
    return {};
  }
}


module.exports = router;
