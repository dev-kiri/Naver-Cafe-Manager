## 네이버 카페 도구
댓글을 달거나 게시글을 삭제할 수 있습니다. 코뿔소에게

카카오톡 봇에서 테스트되었습니다.

마지막 업데이트: 2021년 1월 07일

## 예제
```js
const naver = require('Naver');
const Naver = new naver;

Naver.login('네이버 아이디', '비밀번호'); // 기본적인 로그인
Naver.login('네이버 아이디', '비밀번호', true); // 지속되는 로그인

Naver.logout(); // 현재 세션에서 로그아웃을 한다.
```
네이버에 로그인하면 쿠키를 얻을 수 있다.
댓글을 달 수 있습니다.
```js
const naver = require('Naver');
const Naver = new naver;

Naver.login('네이버 아이디', '비밀번호');
Naver.writeComments('카페 아이디', '게시글 번호', '이것은 내용이다.'); // 댓글을 작성한다.
```
또는 게시글을 삭제한다:
```js
const naver = require('Naver');
const Naver = new naver;

Naver.deleteArticle('카페 아이디', '게시글 번호');
```
전달: 이는 언제라도 작동을 멈출 수 있습니다.

## 라이선스
라이선스: 네이버 모듈은 [MIT 라이선스](https://github.com/dev-kiri/Naver-Cafe-Manager/blob/main/LICENSE)를 따르고 있다.
