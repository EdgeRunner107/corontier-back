var express = require('express');
var router = express.Router();
var db = require('../db');

var multer = require('multer');
const fs = require('fs');
const { route } = require('./mypage');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/kakaologin', function (req, res) {
               console.log(req.body.email)
               const uid = req.body.email;
               const sql = 'select * from users where email=?';
               db.get().query(sql, [uid], function (err, rows) {
                    if(rows.length > 0) {   //아이디있을시
                         
                      res.send( {'result':'1','user_id':rows[0].user_id});
                    }else{
                      res.send({'result':'2'});
                         }
                    });
});



router.post('/kakaologininsert', function (req, res) {
     console.log(req.body.email)
     const uid = req.body.email;
     const unickname = req.body.nickname;
     const Upassword = req.body.sub;
     const sql='insert into users(email,password,nickname) values(?,?,?)';
     db.get().query(sql, [uid,Upassword,unickname], function (err, rows) {
 
               
                    res.send('1');
                  if(err){
                    console.log("sql에러?")
                    res.send({'result':'2'});
                  }
     })
});


router.post('/login', function (req, res) {
    console.log("1번")
    const email = req.body.email;
    const Upassword = req.body.Upassword;

    console.log(email)
    console.log(Upassword)
    const sql = 'select * from users where email=?';
    console.log("2번")
   db.get().query(sql, [email], function (err, rows) {
    console.log("3번")
        if(rows.length > 0) {
            if(rows[0].password == Upassword){
              console.log(rows)
               res.send( {'result':'1','user_id':rows[0].user_id});
            }else{
            res.send({'result':'2'});
            }
       }else{
            res.send({'result':'0'});
       }
  });

  console.log("4번")
 console.log("로그인시도")
});

router.post('/insert', function(req, res){
 
  const email=req.body.email;
  const nickname=req.body.nickname;
  const Upassword=req.body.Upassword;

  console.log(email, nickname, Upassword);

  const sql='insert into users(email,nickname,password) values(?,?,?)';
  db.get().query(sql, [email,nickname,Upassword], function (err, rows) {
    res.send({'result':'1'});
    if(err){
      res.send({'result':'2'});
    }
   })
});
















//특정사용자정보읽기 REST API sessionStorage에 어떤컬럼넣을지에 따라 user_id위치 해당컬럼명으로 변경해야함
router.get('/read/:user_id',function(req,res){
  const user_id = req.params.user_id;
  const sql = "select * from users where user_id = ?";
  db.get().query(sql,[user_id],function(err,rows){
    if(err) console.log(err);
    res.send(rows[0]);
  })
});  
//사용자정보 수정
router.post('/update',function(req,res){
  const user_id = req.body.user_id;
  const password = req.body.password;
  const email = req.body.email;
  const nickname = req.body.nickname;
  const profile_image = req.body.profile_image;

  const sql = 'update users set password = ?, email =?, nickname = ?, profile_image = ?, updated_at=now() where user_id = ? ';
  
  db.get().query(sql,[password,email,nickname,profile_image ,user_id],function(err,rows){
    if(err){
      console.log(err)
      res.send('0');
    } 
    else res.send('1');
  })
});

//profile 사진업로드함수
var upload = multer({
  storage: multer.diskStorage({
    destination:(req,file,done)=>{
      const destination = `./public/users/profile`;
      
      // 디렉토리가 없을 경우 생성.
      fs.mkdirSync(destination, { recursive: true });
      done(null, destination);
    },
    filename:(req,file,done)=>{  
      const user_id = req.query.user_id;      
      const fileName = `${user_id}_${Date.now()}.jpg`;
      done(null, fileName);
    }
  })
});
//profile이미지 업로드
router.post('/update/profile',upload.single('file'),function(req,res){
  const filename = '/users/profile/'+req.file.filename;
  const user_id = req.query.user_id;
  
  const sql = 'update users set profile_image =? where user_id = ?';
  db.get().query(sql,[filename,user_id],function(err){
    if(err) res.send('0')
    else res.send('1')
  });
});

//사용자정보 수정
router.post('/update',function(req,res){
  const user_id = req.body.user_id;
  
  const email = req.body.email;
  const nickname = req.body.nickname;
  const profile_image = req.body.profile_image;

  const sql = 'update users set email =?,nickname=? ,profile_image =? where user_id =?'
  db.get().query(sql,[email,nickname,profile_image,user_id],function(err){
    if(err) res.send('0')
    else res.send('1')
  });
});





router.get('/getproblemlanguagecount/:user_id', function(req, res) {
  const user_id = req.params.user_id;
  console.log("되냐?");
  const sql = `SELECT user_id, sel_language, COUNT(sel_language) AS language_count FROM solutions WHERE user_id = ? AND sel_language IS NOT NULL GROUP BY user_id, sel_language; `;
  db.get().query(sql, [user_id], function(err, rows) {
    console.log("되냐?");
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
      return;
    }
    res.send(rows);
  })
});



router.get('/solvecountlist.json/:user_id', function(req, res) {
  const user_id = req.params.user_id; // 쿼리 스트링에서 user_id 추출

  // user_id를 사용하는 SQL 쿼리 작성
  const sql = `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as day, COUNT(*) as value FROM solutions WHERE user_id = ? GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') ORDER BY day;`;

  // SQL 쿼리 실행
  db.get().query(sql, [user_id], function(err, rows) {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
      return;
    }
    res.send({ list: rows });
  });
});















module.exports = router;
