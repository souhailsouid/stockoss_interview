const fs = require('fs');
const crypto = require('crypto');

let data = fs.readFileSync('./database.json');
data = JSON.parse(data);

/**
 * @constant
 * @route Get /events
 * @default
 */

const GetEventList = (_req, res) => {
  if (!data.length) {
    res.status(404).json({
      success: false,
      message: 'No event found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Event\'s list',
    numberEvent: data.length,
    data,

  });
};
/**
 * @constant
 * @route Get /event/:id
 * @default
 */

const GetEventById = (req, res) => {
  const { params } = req;
  const dataEvent = data.filter((event) =>
    event.id === params.id);

  if (!dataEvent.length) {
    res.status(404).json({
      success: false,
      message: `Pas d'évènement trouvé avec l'id: ${params.id}`
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Event\'s data',
    data: dataEvent
  });
};

const ensureBodyIsLowerCase = (body) => body.toLowerCase();

const AddNewEvent = (req, res) => {
  const {
    title, date, email, description,
  } = req.body;

  const isNotAnyErrors = title && email && date;

  if (!title) {
    res.status(400).json({ error: 'Veuillez définir le title de l\'évènement' });
  }
  if (!email) {
    res.status(400).json({ error: 'Veuillez définir le mail de l\'auteur de la création de l\'évènement' });
  }
  if (!date) {
    res.status(400).json({ error: 'Veuillez définir une date' });
  }

  const newEvent = {
    id: crypto.randomBytes(16).toString('hex'),
    date,
    email: ensureBodyIsLowerCase(email),
    description,
    title,

  };

  if (isNotAnyErrors) {
    data.push(newEvent);
    fs.writeFileSync('./database.json', JSON.stringify(data));
    return res.status(200).json({
      success: true,
      message: `L'évènement ${newEvent.title} a été ajouté.`,
      event: newEvent,
    });
  }
};

/**
 * @constant
 * @route Delete /company/siren/:sirenNumber
 * @default
 */

// const DeleteCompanyBySirenNumber = (req, res) => {
//   const { sirenNumber } = req.params;
//   let isCompanyExistWithSiren = checkCompanyWithSiren(sirenNumber);

//   isCompanyExistWithSiren = isCompanyExistWithSiren.length;
//   const isCompanyNotExistWithThisSiren = !isCompanyExistWithSiren;

//   if (isNaN(sirenNumber)) {
//     res.status(400).json({ error: 'Veuillez définir un numéro de siren valide, ne contenant que des chiffres' });
//   }
//   if (isCompanyNotExistWithThisSiren) {
//     res.status(404).json({
//       success: false,
//       message: `The company with the siren number: ${sirenNumber} do not exist`,
//     });
//   }

//   const updatedList = data.filter((company) => {
//     const { siren } = company;
//     return (
//       siren !== Number(sirenNumber)
//     );
//   });

//   fs.writeFileSync('./mock_data.json', JSON.stringify(updatedList));

//   return res.status(200).json({
//     success: true,
//     message: `The company with the siren number: ${sirenNumber} was successfull deleted`,

//   });
// };

module.exports = {
  GetEventList,
  GetEventById,
  AddNewEvent,
//   AddNewCompany,
//   UpdateCompany,
//   DeleteCompanyBySirenNumber,
};
