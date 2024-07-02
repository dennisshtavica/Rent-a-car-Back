const db = require("../models/mysql");
const Magazine = db.magazine;
const Publisher = db.publisher;

exports.createMagazine = async (req, res) => {
  const magazine = {
    number: req.body.number,
    name: req.body.name,
    type: req.body.type,
    PublisherID: req.body.PublisherID,
  };

  Magazine.create(magazine)
    .then((magazine) => {
      res.send(magazine);
    })
    .catch((err) => {
      console.log(`Error creating magazine: ${err.message}`);
    });
};

// exports.createMagazine = async (req, res) => {
//   const magazine = {
//     number: req.body.number,
//     name: req.body.name,
//     type: req.body.type,
//     PublisherId: req.body.PublisherId,
//   };

//   Magazine.create(magazine)
//     .then((magazine) => {
//       res.send(magazine);
//     })
//     .catch((err) => {
//       console.log(`Error creating user: ${err.message}`);
//     });
// };

exports.getMagazines = (req, res, next) => {
  Magazine.findAll(
    { where: { isDeleted: false }}
  )
    .then((magazines) => {
      res.status(200).send(magazines);
      next();
    })
    .catch((err) => {
      console.log("Err", err);
    });
};


exports.deleteMagazine = (req, res) => {
  Magazine.update({ isDeleted: true }, {
    where: {
      MagazineID: req.params.id
    }
  })
    .then((magazine) => {
      res.status(200).send(magazine);
    })
    .catch((err) => {
      console.log("Err", err);
    });
}