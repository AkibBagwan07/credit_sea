import React from "react";
import styles from "./reportList.module.css"

const ReportList = ({ reports }) => { 
 // console.log(reports)
  return (
    <div className={ styles.creditReportParent}>
      {reports.length === 0 ? (
        <p>No reports available. Upload an XML file to generate a report.</p>
      ) : (<div>
          {reports.map((report) => (
            <div>
              <div className={ styles.basicDeatilsAndSummary}>
                <div className={ styles.basicDetails}>
              <h2>Report for {report.name}</h2>
              <p><strong>Mobile:</strong> {report.mobile}</p>
              <p><strong>PAN:</strong> {report.pan}</p>
                  <p><strong>Credit Score:</strong></p>
                  <p className={styles.creditScore}>{report.creditScore}</p>
              </div>
              <div>
              <h3>Report Summary</h3>
              <p><strong>Total Accounts:</strong> {report.reportSummary.totalAccounts}</p>
              <p><strong>Active Accounts:</strong> {report.reportSummary.activeAccounts}</p>
              <p><strong>Closed Accounts:</strong> {report.reportSummary.closedAccounts}</p>
              <p><strong>Current Balance:</strong> {report.reportSummary.currentBalance}</p>
              <p><strong>Secured Amount:</strong> {report.reportSummary.securedAmount}</p>
              <p><strong>Unsecured Amount:</strong> {report.reportSummary.unsecuredAmount}</p>
                </div>
              </div>
              <h2>Credit Accounts Information:</h2>
              <div className={styles.creditAccounts}>
                {report.creditAccounts.map((creditAccount) => (
                    <div className={styles.cards}>
                     <p><strong>Bank name : </strong>{creditAccount.bankName}</p>
                      <p><strong>Account number : </strong>{creditAccount.accountNumber}</p>
                       <p><strong>Current Balance : </strong> {creditAccount.currentBalance}</p>
                      <p><strong>Amount overdue : </strong>{creditAccount.amountOverdue}</p>
                      <p><strong>Address : </strong>{creditAccount.address.city}{creditAccount.address.firstLine}{ creditAccount.address.secondLine} { creditAccount.address.zipCode}</p>
                  </div>
                  ))}
              </div>
            </div>
          ))}
          </div>
      )}
    </div>
  );
};

export default ReportList;
