const appFunctions = require("../app.js");
require("iconv-lite").encodingExists("cesu-8");

test("8 digits", () => {
  expect(appFunctions.randomPhoneNumber().length).toBe(8);
});

test("confirm phone number only contains numbers", () => {
  expect(Number(appFunctions.randomPhoneNumber())).not.toBeNaN();
});

test("test that the firstname, lastname and gender does not contain any numbers (only letters)", () => {
  expect(Number(appFunctions.pickRandomPerson().firstName)).toBeNaN();
  expect(Number(appFunctions.pickRandomPerson().lastName)).toBeNaN();
  expect(Number(appFunctions.pickRandomPerson().gender)).toBeNaN();
});

test("Confirm that a female CPR-number ends with an even number", () => {
  expect(Number(appFunctions.generateCPR("female").slice(7 - 11) % 2)).toBe(0);
});

test("Confirm that a male CPR-number ends with an odd number", () => {
  expect(Number(appFunctions.generateCPR("male").slice(7 - 11) % 2)).toBe(1);
});

test("Confirm that CPR and DoB is the same", () => {
  let person = appFunctions.CPRNameGenderAndDoB();
  expect(Number(person.CPR.slice(0, 6))).toBe(Number(person.DoB));
});
