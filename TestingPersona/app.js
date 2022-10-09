let person = {
    "firstName" : "",
    "lastName" : "",
    "gender" : "",
    "cpr" : "",
    "address" : "",
    "phone" : ""
}

let phoneNumbers = [
    2, 30, 31, 40, 41, 42, 50, 51, 52, 53, 60, 61, 71, 81, 91, 92, 93, 342, 344, 345, 346, 347, 348, 349, 356, 357, 359, 362, 365, 366, 389, 398, 431, 441, 462, 466,  468,  472,  474,  476,  478,  485, 486,  488, 489,  493, 494, 495, 496,  498, 499,  542, 543,  545,  551, 552, 556, 571, 572, 573, 574, 577, 579, 584, 586-587, 589, 597, 598, 627, 629, 641, 649, 658, 662, 663, 664, 665, 667, 692, 693, 694, 697, 771, 772, 782, 783, 785, 786, 788, 789, 826, 827, 829
]

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "addresses",
    port: "3306"
})

function randomPhoneNumber(){

    let startingDigit = phoneNumbers[Math.floor(Math.random()*phoneNumbers.length-1)].toString()
    let concat = ''

    if(startingDigit.length === 1){
        concat = '' + startingDigit + Math.random().toString().slice(2,9)
        return concat
    }else if(startingDigit.length === 2){
        concat = '' + startingDigit + Math.random().toString().slice(2,8)
        return concat
    }else{
        concat = '' + startingDigit + Math.random().toString().slice(2,7)
        return concat
    }

}

function allDetails(){
    const fs = require('fs')
    let json = fs.readFileSync("./test.json")
    let jsonify = JSON.parse(json)

    let random = Math.floor(Math.random()*jsonify.persons.length-1)
    let randomPerson = jsonify.persons[random]

    person.firstName = randomPerson.name
    person.lastName = randomPerson.surname
    person.gender = randomPerson.gender
    person.phone = randomPhoneNumber()

    console.log("Person: \n" + JSON.stringify(person, null, 6))
}


getCityAndPostalCode = function (){
    return new Promise(function (resolve, reject){
        con.connect(function (err) {
            if (err)
                throw err;
            con.query(`SELECT * FROM postal_code`, function (err, result) {
                if (err)
                    throw err;
                resolve(result)
            });
        });
    })
    

}

function generateAddress(value){
    let postalCodes = []
    let address = ''
    postalCodes = value

    var randomAddress = '';
    var characters = 'abcdefghijklmnopqrstuvwxyzæøå';
    var charactersLength = characters.length;
    for ( var i = 0; i < Math.floor(Math.random()*(30-10)+10); i++ ) {
      randomAddress += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   let postalID = Math.floor(Math.random()*postalCodes.length-1)

   address = `${randomAddress} ${Math.floor(Math.random() * 999) + 1}, ${postalCodes[postalID].cPostalCode} ${postalCodes[postalID].cTownName}`
   console.log(address);
   return address
}

function testAdress(){
    getCityAndPostalCode().then(function(value){
        let postalCodes = []
        let address = ''
        postalCodes = value
    
        var randomAddress = '';
        var characters = 'abcdefghijklmnopqrstuvwxyzæøå';
        var charactersLength = characters.length;
        for ( var i = 0; i < Math.floor(Math.random()*(30-10)+10); i++ ) {
          randomAddress += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       let postalID = Math.floor(Math.random()*postalCodes.length-1)
    
       address = `${randomAddress} ${Math.floor(Math.random() * 999) + 1}, ${postalCodes[postalID].cPostalCode} ${postalCodes[postalID].cTownName}`
       return address
    })
}

function getInfo(){
    con.connect(function (err) {
        if (err)
            throw err;
        con.query(`SELECT * FROM postal_code`, function (err, result) {
            if (err)
                throw err;
            promises.resolve(result)
        });
    });
}

console.log(getInfo)


allDetails();
