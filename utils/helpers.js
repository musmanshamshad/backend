function validateEmail(emailAdress) {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress === null || (emailAdress && emailAdress.match(regexEmail))) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  validateEmail,
};
