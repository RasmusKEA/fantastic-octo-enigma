const randomPhoneNumber = require ('./app.js')

test('8 digits', () => {
    expect(randomPhoneNumber().length).toBe(8)

});