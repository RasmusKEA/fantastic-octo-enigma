var mysql = require("mysql2");
var moment = require("moment");

let phoneNumbers = [
  2, 30, 31, 40, 41, 42, 50, 51, 52, 53, 60, 61, 71, 81, 91, 92, 93, 342, 344,
  345, 346, 347, 348, 349, 356, 357, 359, 362, 365, 366, 389, 398, 431, 441,
  462, 466, 468, 472, 474, 476, 478, 485, 486, 488, 489, 493, 494, 495, 496,
  498, 499, 542, 543, 545, 551, 552, 556, 571, 572, 573, 574, 577, 579, 584,
  586, 587, 589, 597, 598, 627, 629, 641, 649, 658, 662, 663, 664, 665, 667,
  692, 693, 694, 697, 771, 772, 782, 783, 785, 786, 788, 789, 826, 827, 829,
];

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gubbiman1",
  database: "addresses",
  port: "3306",
});

con.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("connected");
  }
});

async function allDetails() {
  let gender = (await pickRandomPerson()).gender;
  let adr = await generateAddress();

  return {
    firstName: (await pickRandomPerson()).name,
    lastName: (await pickRandomPerson()).surname,
    gender: gender,
    phone: await randomPhoneNumber(),
    address: adr,
    cpr: await generateCPR(gender),
  };
}

function pickRandomPerson() {
  const fs = require("fs");
  let json = fs.readFileSync("./test.json");
  let jsonify = JSON.parse(json);

  let random = Math.floor(Math.random() * jsonify.persons.length - 1);
  let randomPerson = jsonify.persons[random];

  return randomPerson;
}

function randomPhoneNumber() {
  let startingDigit =
    phoneNumbers[Math.floor(Math.random(2, 8) * phoneNumbers.length - 1)];
  startingDigit;
  let concat = "";

  if (startingDigit.toString().length === 1) {
    concat = "" + startingDigit + Math.random().toString().slice(2, 9);
    return concat;
  } else if (startingDigit.toString().length === 2) {
    concat = "" + startingDigit + Math.random().toString().slice(2, 8);
    return concat;
  } else {
    concat = "" + startingDigit + Math.random().toString().slice(2, 7);
    return concat;
  }
}

module.exports = randomPhoneNumber;

async function generateAddress() {
  let adr = await getInfo();
  let postalCodes = [];
  let address = "";
  postalCodes = await adr;

  var randomAddress = "";
  var characters = "abcdefghijklmnopqrstuvwxyzæøå";
  var charactersLength = characters.length;
  for (var i = 0; i < Math.floor(Math.random() * (30 - 10) + 10); i++) {
    randomAddress += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  let postalID = Math.floor(Math.random() * postalCodes.length - 1);

  address = `${randomAddress} ${Math.floor(Math.random() * 999) + 1}, ${
    postalCodes[postalID].cPostalCode
  } ${postalCodes[postalID].cTownName}`;
  return address;
}

async function getInfo() {
  var sql = "SELECT * FROM postal_code";
  const results = await con.promise().query(sql);
  return results[0];
}

function generateCPR(gender) {
  const birthday = moment(randomDate(new Date(1908, 0, 1), new Date())).format(
    "DDMMYY"
  );

  if (gender === "male") {
    let endingDigits = Math.floor(1000 + (Math.random() * 9000) / 2) * 2 + 1;
    if (endingDigits > 10000) {
      endingDigits = Math.floor(1000 + (Math.random() * 9000) / 2) * 2 + 1;
    }
    return birthday + "-" + endingDigits;
  } else if (gender === "female") {
    let endingDigits = Math.floor(1000 + (Math.random() * 9000) / 2) * 2;
    if (endingDigits > 10000) {
      endingDigits = Math.floor(1000 + (Math.random() * 9000) / 2) * 2;
    }
    return birthday + "-" + endingDigits;
  }
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function nameGenderAndDoB() {
  return {
    firstName: pickRandomPerson().name,
    lastName: pickRandomPerson().surname,
    gender: pickRandomPerson().gender,
    DoB: generateCPR(pickRandomPerson().gender).slice(0, 6),
  };
}

function CPRNameAndGender() {
  return {
    firstName: pickRandomPerson().name,
    lastName: pickRandomPerson().surname,
    gender: pickRandomPerson().gender,
    CPR: generateCPR(pickRandomPerson().gender),
  };
}

function CPRNameGenderAndDoB() {
  return {
    firstName: pickRandomPerson().name,
    lastName: pickRandomPerson().surname,
    gender: pickRandomPerson().gender,
    CPR: generateCPR(pickRandomPerson().gender),
    DoB: generateCPR(pickRandomPerson().gender).slice(0, 6),
  };
}

async function allDetailsBulk(amount) {
  let bulk = [];
  let person = {
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    address: "",
    cpr: "",
  };

  if (amount < 2 || amount > 100) {
    return "Amount is not between 2 and 100";
  }

  for (let index = 0; index < amount; index++) {
    bulk.push({
      firstName: allDetails().firstName,
      lastName: allDetails().lastName,
      gender: (await allDetails()).gender,
      phone: allDetails().phone,
      address: (await allDetails()).address,
      cpr: (await allDetails()).cpr,
    });
  }
  return bulk;
}

console.log(
  "Name, gender, CPR and DoB: " + JSON.stringify(CPRNameGenderAndDoB())
);
console.log("Name, gender and DoB: " + JSON.stringify(nameGenderAndDoB()));
console.log("Name, gender and CPR: " + JSON.stringify(CPRNameAndGender()));
console.log("Female CPR: " + generateCPR("female"));
console.log("Male CPR: " + generateCPR("male"));
console.log("Birthday: " + generateCPR("male").slice(0, 6));
console.log("Phone number: " + JSON.stringify(randomPhoneNumber()));
console.log("Full name and gender: " + JSON.stringify(pickRandomPerson()));
allDetails().then((d) => {
  console.log("All details: " + JSON.stringify(d));
});
generateAddress().then((a) => {
  console.log("Address: " + JSON.stringify(a));
});

allDetailsBulk(5).then((b) => {
  console.log("Bulk: " + JSON.stringify(b));
});
