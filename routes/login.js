const express = require('express')
const router = express.Router()
const request = require('request')
const url = require('url')

router.get('/', (req, res) => {
    res.render('login.html')
})

router.get('/oauth-login-grant', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'code',
            'client_id': 'client',
            'redirect_uri': 'http://localhost:3005/login/oauth-grant',
            'scope': 'read'
        }
    }))
})

router.get('/oauth-grant', (req, res) => {
    const code = req.query['code']
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'scope': 'read',
            'redirect_uri': 'http://localhost:3005/login/oauth-grant'
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
    
            console.log(token)
            res.send(token)
        }
    }
    
    request(options, callback)
})

router.get('/oauth-login-implicit', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'token',
            'client_id': 'client',
            'redirect_uri': 'http://localhost:3005/login/oauth-implicit',
            'scope': 'read'
        }
    }))
})

router.get('/oauth-implicit', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:3000/'
    }))
})

router.get('/oauth-login-password', (req, res) => {
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'password',
            'scope': 'read',
            'user': 'foo',
            'password': 'foo'
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
    
            console.log(token)
            res.send(token)
        }
    }
    
    request(options, callback)
})

router.get('/oauth-login-client', (req, res) => {
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'client_credentials',
            'scope': 'read',
        }
    }
    
    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
    
            console.log(token)
            res.send(token)
        }
    }
    
    request(options, callback)
})

module.exports = router
