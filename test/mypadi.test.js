// 1 - require both Sails and Supertest
var sails = require('sails');
const request = require('supertest');
// 2 - Setup Lifecycle

// Global before hook
beforeAll(function (done) {
    sails.lift({
        // Your Sails app's configuration files will be loaded automatically,
        // but you can also specify any other special overrides here for testing purposes.

        // For example, we might want to skip the Grunt hook,
        // and disable all logs except errors and warnings:
        hooks: { grunt: false },
        log: { level: 'warn' },

    }, function (err) {
        if (err) { return done(err); }

        // here you can load fixtures, etc.
        // (for example, you might want to create some records in the database)

        return done();
    });
});

// Global after hook
afterAll(function (done) {
    // here you can clear fixtures, etc.
    // (e.g. you might want to destroy the records you created above)

    sails.lower(done);

});

// 3 - Write your tests

describe('Home', () => {
    it('/ - returns 200', (done) => {
        request(sails.hooks.http.app)
            .get('/')
            .expect(200)
            .then(res => {
                expect(res.body.message).toBe("You have reached myPadi web service")
                done();
            }).catch(err => done(err))
    })
})

describe('user routes', () => {
    it('Signs up new user', (done) => {
        const data = {
            fullName: 'Achilles',
            emailAddress: 'achilles@gmail.com',
            password: '123467'
        }
        request(sails.hooks.http.app)
            .post('/user/signup')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                expect(res.body.message).not.toBeUndefined();
                expect(res.body.data).not.toBeUndefined();
                expect(res.body.token).not.toBeUndefined();

                done();
            })
            .catch(err => {
                console.log(err);
                done(err)
            })

    })

    it('Signs in existing user', (done) => {
        const data = {
            emailAddress: 'achilles@gmail.com',
            password: '123467'
        }
        request(sails.hooks.http.app)
            .post('/user/signin')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.message).not.toBeUndefined();
                expect(res.body.data).not.toBeUndefined();
                expect(res.body.token).not.toBeUndefined();

                done();
            })
            .catch(err => {
                console.log(err);
                done(err)
            })
    })

    it("Do not signup user with password length < 6 characters", (done) => {
        const payload = {
            fullName: 'Mercury Brown',
            emailAddress: 'mercury@gmail.com',
            password: 'merc'
        }
        request(sails.hooks.http.app)
            .post('/user/signup')
            .send(payload)
            .expect(400, done);
    })

    it("A logged in user can create new listing", (done) => {
        const payload = {
            fullName: 'Kelvin Omereshone',
            emailAddress: 'kelvinomereshone@gmail.com',
            password: 'noblebright'
        }
        request(sails.hooks.http.app)
            .post('/user/signup')
            .send(payload)
            .expect(201)
            .then(res => {
                const payload = {
                    name: 'Mypadi Hostel',
                    type: 'Bedsitter',
                    address: 'No 1. Something street',
                    rent: '100k per year'
                }
                request(sails.hooks.http.app)
                    .post('/listing/new')
                    .set('Authorization', `Bearer ${res.body.token}`)
                    .send(payload)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).toBe('New listing created successfully')
                        expect(res.body.data).not.toBeUndefined()
                        done();
                    })
                    .catch(err => done(err))
            })
            .catch(err => done(err))
    })
})