const express = require('express')
const router = express.Router()
const request = require('request')
const url = require('url')

/* GET users listing. */
router.get('/', (req, res) => {
    res.render('login.html')
})

router.get('/oauth-login', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:9000/oauth/authorize',
        query: {
            'response_type': 'code',
            'client_id': 'client',
            'redirect_uri': 'http://localhost:3005/login/oauth',
            'scope': 'read'
        }
    }))
})

router.get('/oauth', (req, res) => {
    const code = req.query['code']
    const options = {
        url: 'http://client:secret@localhost:9000/oauth/token',
        method: 'POST',
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'scope': 'read',
            'redirect_uri': 'http://localhost:3005/login/oauth'
        }
    }
    
    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const token = JSON.parse(body)['access_token']
            const options = {
                url: 'http://localhost:9090/account',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        
            request(options, (error, response, body) => {
                const accountInfo = JSON.parse(body)
    
                console.log(accountInfo)
            
                res.send('Get Account!')
            })
        }
    })
})

router.get('/logout', (req, res) => {
    res.redirect(url.format({
        pathname: 'http://localhost:3005'
    }))
})

module.exports = router
