let express = require('express');
let router = express.Router();

router.get('/test', (req, res) => {
    res.status(200).json({
        name: "ItsaMe",
        message: "yooo"
    })
});

module.exports = router;