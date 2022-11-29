const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const mobileNoCheck = mobileNo => {
  if(!mobileNo || mobileNo.length < 5 || mobileNo.charAt(0) !== '+') return false;
  const number = phoneUtil.parseAndKeepRawInput(mobileNo, '');
  return (phoneUtil.isPossibleNumber(number) && phoneUtil.isValidNumber(number));
}

module.exports = mobileNoCheck;