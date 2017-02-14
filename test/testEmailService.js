var expect = require("chai").expect;
var emailService = require("../routes/index.js");
var request = require("request");

describe("Email Service Test", function () {
    this.timeout(15000);
    describe("Using SendGrid", function () {
        it("Sends an email", function (done) { 
            request.post({ url: 'http://localhost:1337/emailInfo', form: { 'email': 'nishant.mhatre@varahitechnologies.com' } },
                 function (err, httpResponse, body) {
                var result = JSON.parse(body);
                expect(result.data.message).to.equal("success");
                expect(httpResponse.statusCode).to.equal(200);
                done();
            });
        });
    });
});

describe("Email Service Test", function () {
    this.timeout(15000);
    describe("Using mailgun", function () {
        it("Sends an email", function (done) {
            request.post({ url: 'http://localhost:1337/emailInfo', form: { 'email': 'nishant.mhatre@varahitechnologies.com' } },
                 function (err, httpResponse, body) {
                var result = JSON.parse(body);
                expect(result.data.message).to.equal("Queued. Thank you.");
                expect(httpResponse.statusCode).to.equal(200);
                done();
            });
        });
    });
});