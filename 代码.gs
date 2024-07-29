function edited(email, username) {
  const template = HtmlService.createTemplateFromFile('edited');
  template.name = username;
  const body = template.evaluate().getContent();

  MailApp.sendEmail({
    to: email,
    subject: "Information Edited",
    htmlBody: body,
    noReply: true,
    replyTo: "AppRookies@gmail.com" // Example Email
  });
}

function created(email, username) {
  const template = HtmlService.createTemplateFromFile('created');
  const sheet = SpreadsheetApp.openById('1jwlP-acGnSGQpKfg0buuFxRdbV9UQtGEzv--WDGCIFE').getSheetByName('UserTable');
  const data = sheet.getDataRange().getValues();
  template.name = username;
  template.email = email;
  const body = template.evaluate().getContent();

  let adminEmails = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === "Admin") {
      adminEmails.push(data[i][2]);
    }
  }

  if (adminEmails.length > 0) {
    MailApp.sendEmail({
      to: adminEmails.join(','),
      subject: "New User Signed Up",
      htmlBody: body,
      noReply: true,
      replyTo: "AppRookies@gmail.com" // Example Email
    });
  }
}

function Calculate(salary, department, sheetname){
  if (department == 'Intern' || salary == 0) {
    return 0;
  }
  const data=SpreadsheetApp.openById('1jwlP-acGnSGQpKfg0buuFxRdbV9UQtGEzv--WDGCIFE').getSheetByName(sheetname).getDataRange().getValues();
  calValues = [];
  for (let i = 1; i < data.length; i++) { // Skip header row
    calValues.push({
      range_wage: parseFloat(data[i][0]),
      rate: parseFloat(data[i][1])
    });
  }
  //Calculate
  let rate = 0;
  for (let i = 0; i < calValues.length; i++) {
    if (salary <= calValues[i].range_wage) {
      rate = calValues[i].rate;
      break;
    }
  }
  if (salary > calValues[calValues.length - 1].range_wage) {
    rate = calValues[calValues.length - 1].rate;
  }
  
  return rate;
}

function deleteRowWhenUserLeaves(userEmail) {
  var sheet = SpreadsheetApp.openById('1jwlP-acGnSGQpKfg0buuFxRdbV9UQtGEzv--WDGCIFE').getSheetByName('Login');
  var data = sheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) { // Iterate from the last row to the first row
    if (data[i][0] == userEmail) { // Assuming the email is in the first column (index 0)
      sheet.deleteRow(i + 1); // Adjust for header row
    }
  }
}

