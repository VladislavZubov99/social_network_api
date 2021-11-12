class Validator {
  constructor({
    min= 6,
    max= 26,
    lowerCase= 1,
    upperCase= 1,
    numeric= 1,
    symbol= 1,
  }) {
    this.options = {
      min,
      max,
      lowerCase,
      upperCase,
      numeric,
      symbol,
    }
    this.messages = {
      'tooShort':
        `Should be at least ${this.options.min}`,
      'tooLong':
        `Should not be longer than ${this.options.max}`,
      'lowercase':
        `Should contain at least ${this.options.lowerCase} lower-cased string`,
      'uppercase':
        `Should contain at least ${this.options.upperCase} upper-cased string`,
      'numeric':
        `Should contain at least ${this.options.numeric} number`,
      'symbol':
        `Should contain at least ${this.options.symbol} symbol`,
    }
  }

  validate = (value) => {
    const errors = [];

    const {
      min,
      max,
      lowerCase,
      upperCase,
      numeric,
      symbol,
    } = this.options


    if (typeof value === 'string') {
      const lowercaseCount = value.match(/[a-z]/g) ? value.match(/[a-z]/g).length : 0;
      const upperCaseCount = value.match(/[A-Z]/g) ? value.match(/[A-Z]/g).length : 0;
      const numericCount = value.match(/[0-9]/g) ? value.match(/[0-9]/g).length : 0;
      const symbolCount = value.match(/[^a-zA-Z0-9]/g) ? value.match(/[^a-zA-Z0-9]/g).length : 0;

      const meetsMin = min && value.length >= min;
      const meetsMax = max && value.length <= max;

      const meetsLowercase = lowercaseCount >= (lowerCase);
      const meetsUppercase = upperCaseCount >= (upperCase);
      const meetsNumeric = numericCount >= (numeric);
      const meetsSymbol = symbolCount >= (symbol);


      if (!meetsMin) errors.push(this.messages.tooShort);
      if (!meetsMax) errors.push(this.messages.tooLong);
      if (!meetsLowercase) {
        errors.push(this.messages.lowercase);
      }
      if (!meetsUppercase) {
        errors.push(this.messages.uppercase);
      }
      if (!meetsNumeric) {
        errors.push(this.messages.numeric);
      }
      if (!meetsSymbol) {
        errors.push(this.messages.symbol);
      }
    }

    return {
      value,
      errors: errors.length ? errors : null,
    };
  }

}

module.exports = Validator