const paramsCanNotBeNegative = (req, res, next) => {
  const {
    offset,
    limit,
    comment_offset,
    comment_limit
  } = req.query;

  const mustNotBeLessThenZero = {
    offset,
    limit,
    comment_offset,
    comment_limit
  }

  for (let [key, value] of Object.entries(mustNotBeLessThenZero)) {
    if (value === undefined) continue;

    const numValue = Number(value);
    if (isNaN(numValue)) return res.status(400).send({
      message: `${key} can be number`
    })

    if (!isNaN(numValue) && numValue < 0) return res.status(400).send({
      message: `${key} can not be negative`
    });
  }

  return next();
};

module.exports = paramsCanNotBeNegative;