## Naver-Cafe-Manager
Either writing comments or deleting articles is avaliable. For Rhino js

Tested on KakaoTalk Bot.

Last Update: January 05 2021

## Example
```js
const naver = require('Naver');
const Naver = new naver;

Naver.login('YOUR NAVERID', 'YOUR PASSWORD'); // simple login
Naver.login('YOUR NAVERID', 'YOUR PASSWORD', true); // login continue

Naver.logout(); // logout from saved sessions
```
By logging in Naver, you can acquire cookies.
Writing comments is available.
```js
const naver = require('Naver');
const Naver = new naver;

Naver.login('YOUR NAVERID', 'YOUR PASSWORD');
Naver.writeComments('cafeId', 'articleId', 'THIS IS CONTENT'); // write comments
```
or deleting articles:
```js
const naver = require('Naver');
const Naver = new naver;

Naver.deleteArticle('cafeId', 'articleId');
```
Note: It can stop working anytime.

## License
License: Naver module is following [MIT License](https://github.com/dev-kiri/Naver-Cafe-Manager/blob/main/LICENSE).
