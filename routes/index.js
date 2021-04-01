const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('ThaliHelp Server')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

//@desc Adding new user
//@router POST /adduser
router.post('/adduser', actions.addNew)

router.get('/getjournal',actions.getjournal)

router.get('/getone',actions.getone)

router.get('/getallbp',actions.getallbp)

router.get('/getalliron',actions.getalliron)

router.get('/getallheartrate',actions.getallheartrate)

router.post('/postajournal',actions.postajournal)
// router.get('/getjournal',actions.getjournal)
//@desc Authenticate a user
//@route POST /authenticate
router.post('/authenticate', actions.authenticate)

//@desc Get info on a user
//@route GET /getinfo
router.get('/getinfo', actions.getinfo)

router.get('/getuser',actions.getuser)

router.post('/appendtobp',actions.addbp)

router.post('/appendtoiron',actions.addiron)

router.post('/appendtoheartrate',actions.addheartrate)
module.exports = router