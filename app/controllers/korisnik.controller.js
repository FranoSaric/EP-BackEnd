exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.studentBoard = (req, res) => {
  res.status(200).send("Student Content.");
};

exports.djelatnikBoard = (req, res) => {
  res.status(200).send("Djelatnik Content.");
};
