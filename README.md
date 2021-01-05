## Naver-Cafe-Manager
Either writing comments or deleting aricles is avaliable. -For Rhino js-
It had be

## Example
```js
const Naver = require('Naver');

new Naver('YOUR NAVERID', 'YOUR PASSWORD').login(); // simple login
new Naver('YOUR NAVERID', 'YOUR PASSWORD').login(true); // login continue
```
By logging in Naver, you can acquire cookies.
Writing comments is available.
```js
const Naver = require('Naver');

const naver = new Naver('YOUR NAVERID', 'YOUR PASSWORD').login(true);

naver.writeComments('cafeId', 'articleId', 'THIS IS CONTENT'); // write comments
```
or deleting articles:
```js
const Naver = require('Naver');

const naver = new Naver('YOUR NAVERID', 'YOUR PASSWORD').login(true);

naver.deleteArticle('cafeId', 'articleId');
```
Note: It can stop working anytime.

## License
License: Naver module is following [MIT License](https://github.com/dev-kiri/Naver-Cafe-Manager/blob/main/LICENSE).
