var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const express = require('express');
const router = express.Router();
const axios = require('axios'); // axios를 포함합니다.

// ... 나머지 코드

const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_GRANT_TYPE = "authorization_code";
const KAKAO_CLIENT_ID = "=------"; // 대소문자 주의!
const KAKAO_REDIRECT_URI = "http://localhost:5000/kakao/code"; // 변수명 수정

// 기본 페이지 라우트
router.get('/', function(req, res) {
    res.send('<h1>Welcome!</h1>');
});

router.get('/kakao/code', async function (req, res) {
  const code = req.query.code; // 요청에서 인증 코드 가져오기
  try {
    console.log("시도중...");
    const response = await axios.post(KAKAO_OAUTH_TOKEN_API_URL, {
      grant_type: KAKAO_GRANT_TYPE,
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT_URI,
      code: code,
    }, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
    });
    console.log("----------------------토큰임--------------");
    console.log(response.data['access_token']); // 액세스 토큰 출력

    // 토큰을 사용한 추가 작업...
    res.send('1'); // 클라이언트에게 토큰 정보 전송

  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString()); // 오류 응답
  }
});

module.exports = router;



module.exports = router;
