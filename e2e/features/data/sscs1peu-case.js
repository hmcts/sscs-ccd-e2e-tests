const faker = require('faker/locale/en_GB');
var po = 'DA'+faker.random.number({'min': 1,'max': 4})+ ' 5TB';
const moment = require('moment');

module.exports = {
  sscsPeuFormData : [
    { question: 'mrn_date', answer: mrnDate() },
    { question: 'benefit_type_description', answer: 'PIP' },
    { question: 'person1_title', answer: 'Mr' },
    { question: 'person1_first_name', answer: 'Mark' },
    { question: 'person1_last_name', answer: 'Smith' },
    { question: 'person1_address_line1', answer: '999 Road Lane' },
    { question: 'person1_address_line2', answer: 'Town Name' },
    { question: 'person1_address_line3', answer: 'City Name' },
    { question: 'person1_address_line4', answer: 'County Name' },
    { question: 'person1_postcode', answer: 'DA7 5DX' },
    { question: 'person1_nino', answer: ''},
    { question: 'is_hearing_type_oral', answer: 'true' },
    { question: 'is_hearing_type_paper', answer: 'false' },
    { question: 'hearing_type_telephone', answer: 'true' },
    { question: 'hearing_type_video', answer: 'false' },
    { question: 'hearing_type_face_to_face', answer: 'false' },
    { question: 'hearing_telephone_number', answer: '07895123456' },
    { question: 'office', answer: '3' }
    ]
};

function getTodaysDate() {
  var d = new Date();
  var month = 1 + d.getUTCMonth();
  var todaysDate =  d.getDate() + "/" + month + "/" + d.getUTCFullYear();
  return todaysDate;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function mrnDate(){
  return moment().subtract(getRandomInt(1, 25), 'days').format('DD/MM/YYYY');
}
