'use strict';

/*

MIT License

Copyright (c) 2020 Kiri-js

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//from License.txt

const lzstring = require('./lzstring');

module.exports = (function () {
    function Naver() {
        this.cookies = {};
    }
    function getLenChar(value) {
            return String.fromCharCode(value.length);
    }
    Naver.prototype.login = function (id, pw) {
            const response = org.jsoup.Jsoup.connect('https://nid.naver.com/login/ext/keys2.nhn').get().text();
            const segrementedKeys = response.split(',');
            const sessionkey = segrementedKeys[0];
            const keyname = segrementedKeys[1];
            const nvalue = segrementedKeys[2];
            const evalue = segrementedKeys[3];
            const message = getLenChar(sessionkey) + sessionkey + getLenChar(id) + id + getLenChar(pw) + pw;
            const n = new java.math.BigInteger(nvalue, 16);
            const e = new java.math.BigInteger(evalue, 16);
            const m = new java.lang.String(message);
            const KeyFactory = java.security.KeyFactory.getInstance('RSA');
            const RSAPublicKeySpec = new java.security.spec.RSAPublicKeySpec(n, e);
            const Key = KeyFactory.generatePublic(RSAPublicKeySpec);
            const cipher = javax.crypto.Cipher.getInstance('RSA/None/PKCS1Padding');
            cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, Key);
            const bytes = m.getBytes('UTF-8');
            const byte = cipher.doFinal(bytes);
            const hex = new java.math.BigInteger(1, byte);
            const encpw = hex.toString(16);
            const uuid = java.util.UUID.randomUUID().toString();
            const data = '{"a":"'+uuid+'-4","b":"1.3.4","d":[{"i":"id","b":{"a":["0,'+id+'"]},"d":"'+id+'","e":false,"f":false},{"i":"pw","e":true,"f":false}],"h":"1f","i":{"a":"Mozilla/5.0"}}';
            const encData = lzstring.compressToEncodedURIComponent(data);
            const bvsd = '{"uuid":"' + uuid + '","encData":"' + encData + '"}'; 
            const con = org.jsoup.Jsoup.connect('https://nid.naver.com/nidlogin.login')
                .userAgent('Mozilla/5.0')
                .method(org.jsoup.Connection.Method.POST)
                .header('Content-Type', 'application/x-www-form-urlencoded')
                .data('encpw', encpw)
                .data('enctp', 1)
                .data('svctype', 1)
                .data('smart_LEVEL', -1)
                .data('bvsd', bvsd)
                .data('encnm', keyname)
                .data('locale', 'ko_KR')
                .data('url', 'https://naver.com')
                .execute();
        if (!con.cookie('NID_AUT'))
            throw new Error('Some Error occured during authentication.');
        Object.assign(this.cookies, {
           nid_inf: con.cookie('nid_inf'),
           NID_AUT: con.cookie('NID_AUT'),
           NID_JKL: con.cookie('NID_JKL'),
           NID_SES: con.cookie('NID_SES')
        });
    };
    Naver.prototype.logout = function () {
        if (!this.cookies.NID_AUT)
            throw new ReferenceError('It is called before Initialization.');
        org.jsoup.Jsoup.connect('https://nid.naver.com/nidlogin.logout?returl=https%3A%2F%2Fwww.naver.com')
            .cookies({
              NID_AUT: this.cookies.NID_AUT,
              NID_SES: this.cookies.NID_SES
            }).execute();
        this.cookies = {};
    };
    Naver.prototype.writeComments = function (cafeId, articleId, content) {
        const con = org.jsoup.Jsoup.connect('https://apis.naver.com/cafe-web/cafe-mobile/CommentPost.json')
            .userAgent('Mozilla/5.0')
            .method(org.jsoup.Connection.Method.POST)
            .header('Content-Type', 'application/x-www-form-urlencoded')
            .header('Referer', 'https://cafe.naver.com/ca-fe/cafes/' + cafeId + '/articles/1?referrerAllArticles=true&oldPath=%2FArticleRead.nhn%3Fclubid%3D' + cafeId + '%26articleid%3D' + articleId + '%26referrerAllArticles%3Dtrue')
            .header('X-Cafe-Product', 'pc')
            .cookies({
                nid_inf: this.cookies.nid_inf,
                NID_AUT: this.cookies.NID_AUT,
                NID_JKL: this.cookies.NID_JKL,
                NID_SES: this.cookies.NID_SES
            }).data('content', content)
            .data('cafeId', cafeId)
            .data('articleId', articleId)
            .data('requestedFrom', 'A')
            .ignoreContentType(true);
        return con.execute().body();
    }
    Naver.prototype.deleteArticle = function (cafeId, articleId) {
        const con = org.jsoup.Jsoup.connect('https://apis.naver.com/cafe-web/cafe2/ArticleDelete.json')
            .userAgent('Mozilla/5.0')
            .method(org.jsoup.Connection.Method.POST)
            .header('Content-Type', 'application/x-www-form-urlencoded')
            .header('Referer', 'https://cafe.naver.com/ca-fe/cafes/' + cafeId + '/articles/1?referrerAllArticles=true&oldPath=%2FArticleRead.nhn%3Fclubid%3D' + cafeId + '%26articleid%3D' + articleId + '%26referrerAllArticles%3Dtrue')
            .header('X-Cafe-Product', 'pc')
            .cookies({
                nid_inf: this.cookies.nid_inf,
                NID_AUT: this.cookies.NID_AUT,
                NID_JKL: this.cookies.NID_JKL,
                NID_SES: this.cookies.NID_SES
            }).data('cafeId', cafeId)
            .data('articleId', articleId)
            .data('requestedFrom', 'A')
            .ignoreContentType(true)
            .ignoreHttpErrors(true);
        return con.execute().body();
    }
    Naver.prototype.writeArticle = function (cafeId, subject, content) {
        const contentJson = {
            "document": {
                "version": "2.5.1",
                "theme": "default",
                "language": "ko-KR",
                "components": [
                    {
                        "id": "SE-b7de985a-54e8-4842-a615-01bd109f06c8",
                        "layout": "default",
                        "value": [
                            {
                                "id": "SE-c2d1968d-5658-4f53-b8f5-aaeadab3c2f0",
                                "nodes": [
                                    {
                                        "id": "SE-dcacbf9d-62fc-4b4e-be89-723dc08ef4ac",
                                        "value": content,
                                        "@ctype": "textNode"
                                    }
                                ],
                                "@ctype": "paragraph"
                            }
                        ],
                        "@ctype": "text"
                    }
                ]
            },
            "documentId": ""
        };
        const payload = {
            "article": {
                "cafeId": cafeId,
                "contentJson": JSON.stringify(contentJson),
                "from": "pc",
                "menuId": 1,
                "subject": subject,
                "tagList": [],
                "editorVersion": 4,
                "parentId": 0,
                "open": false,
                "naverOpen": true,
                "externalOpen": true,
                "enableComment": true,
                "enableScrap": true,
                "enableCopy": true,
                "useAutoSource": false,
                "cclTypes": [],
                "useCcl": false
            }
        };
        const con = org.jsoup.Jsoup.connect('https://apis.naver.com/cafe-web/cafe-editor-api/v1.0/cafes/' + cafeId + '/menus/1/articles')
            .userAgent('Mozilla/5.0')
            .header('Content-Type', 'application/json;charset=UTF-8')
            .header('X-Cafe-Product', 'pc')
            .cookies({
                nid_inf: this.cookies.nid_inf,
                NID_AUT: this.cookies.NID_AUT,
                NID_JKL: this.cookies.NID_JKL,
                NID_SES: this.cookies.NID_SES
            }).requestBody(JSON.stringify(payload))
            .ignoreContentType(true)
            .ignoreHttpErrors(true)
            .method(org.jsoup.Connection.Method.POST);
        return con.execute().body();
    }
    return Naver;
})();
