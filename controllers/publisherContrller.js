const db = require("../models/mysql");
const Publisher = db.publisher;
const Magazine = db.magazine;

exports.newPublisher = async (req, res) => {
  const publisher = {
    name: req.body.name,
    surname: req.body.surname,
    birthyear: null
  }

  Publisher.create(publisher)
    .then((publisher) => {
      res.send(publisher)
    })
    .catch((err) => {
      console.log(`Error creating user: ${err.message}`);
    });
}

exports.getPublisher = (req, res, next) => {
  Publisher.findAll({
    where: { isDeleted: false }
  })
    .then((publishers) => {
      res.status(200).send(publishers);
      next();
    })
    .catch((err) => {
      console.log("Err", err);
    });
};

exports.deletePublisher = (req, res) => {
  // soft delete
  Publisher.update({ isDeleted: true }, {
    where: {
      PublisherID: req.params.id
    }
  })
    .then((publisher) => {
      res.status(200).send(publisher);
    })
    .catch((err) => {
      console.log("Err", err);
    });
}