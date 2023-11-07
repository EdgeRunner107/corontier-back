var express = require('express');
var router = express.Router();
var db = require('../db');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/kakaologin', function (req, res) {
               console.log(req.body.email)
               const uid = req.body.email;
               const sql = 'select * from user where email=?';
               db.get().query(sql, [uid], function (err, rows) {
                    if(rows.length > 0) {   //아이디있을시
                         
                            res.send('1');
                    }else{
                         res.send('2');
                         }
                    });
});



router.post('/kakaologininsert', function (req, res) {
     console.log(req.body.email)
     const uid = req.body.email;
     const unickname = req.body.nickname;
     const Upassword = req.body.sub;
     const sql='insert into user(email,password,nickname) values(?,?,?)';
     db.get().query(sql, [uid,unickname,Upassword], function (err, rows) {
 
               
                  res.send('1');
                  if(err){
                    res.send('2');
                  }
     })
});











router.post('/login', function (req, res) {
    console.log("1번")
    const uid = req.body.uid;
    const upass = req.body.upass;

    console.log(uid)
    console.log(upass)
    const sql = 'select * from user where email=?';
    console.log("2번")
   db.get().query(sql, [uid], function (err, rows) {
        if(rows.length > 0) {
            if(rows[0].password == upass){
               res.send('1');
            }else{
            res.send('2');
            }
       }else{
            res.send('0');
       }
  });

  console.log("3번")
 console.log("로그인시도")
});

module.exports = router;
