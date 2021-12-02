var conn = require('../includes/db')
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    conn.query("select * from tb_users order by name", (err, results)=>{

    if (err) {

        res.send(err)
      
    }
    else{
        
        res.send(results)

    }

  })
});

module.exports = router;
