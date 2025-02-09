const mongoose = require("mongoose");

const CreditReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  pan: { type: String, required: true },
  creditScore: { type: String, required: true },
  reportSummary: {
    totalAccounts: { type: Number, required: true },
    activeAccounts: { type: Number, required: true },
    closedAccounts: { type: Number, required: true },
    currentBalance: { type: Number, required: true },
    securedAmount: { type: Number, required: true },
    unsecuredAmount: { type: Number, required: true },
  },
  creditAccounts: [
    {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      amountOverdue: { type: Number, required: true },
      currentBalance: { type: Number, required: true },
      creditLimit: { type: Number },
      openDate: { type: Date },
      address: {
        firstLine: { type: String },
        secondLine: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        countryCode: { type: String },
      },
    },
  ],
});

module.exports = mongoose.model("CreditReport", CreditReportSchema);
