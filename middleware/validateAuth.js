const Validator = require('../libs/passwordValidator')

const passwordValidator = new Validator({
  upperCase: 0,
  symbol: 0
})

function validateEmail(email) {
  const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(String(email).toLowerCase());
}

const validateAuth = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  const mustNotBeEmpty = {
    email,
    password,
  };

  for (let [key, value] of Object.entries(mustNotBeEmpty)) {
    if (value === undefined || value === null || value === '') return res.status(400).send({
      message: `${key} can not be empty`
    });
  }

  const isValidEmail = validateEmail(email);

  console.log(isValidEmail)

  if (!isValidEmail) return res.status(400).send({
    message: `Email is not valid`,
  });

  const { errors } = passwordValidator.validate(password);

  if(errors !== null) return res.status(400).send({
    message: `Password is not valid`,
    errors
  });

  return next();
};

module.exports = validateAuth;