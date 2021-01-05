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

const LZString = require('./lzstring');

module.exports = function (username, password) {

    /**
     * @constructor
     * @author Kiri
     */
    function Naver() {
        this.username = username || null;
        this.password = password || null;
        this.uuid = null;
        this.cookies = {};
        this.userAgent = 'Mozilla/5.0';
    }

    /**
     *
     * @param {Boolean} logincontinue
     * @returns this 
     */
    Naver.prototype.login = function (logincontinue) {

        if (!this.username || !this.password) throw new ReferenceError('No username or password.'); 

        function getLenChar(value) {
            return String.fromCharCode(value.length);
        }

        function encrypt(n, e, m) {

            const keyFactory = java.security.KeyFactory.getInstance('RSA'),
                  nvalue = new java.math.BigInteger(n, 16),
                  evalue = new java.math.BigInteger(e, 16),
                  pks = new java.security.spec.RSAPublicKeySpec(nvalue, evalue),
                  key = keyFactory.generatePublic(pks),
                  cipher = javax.crypto.Cipher.getInstance('RSA/None/PKCS1Padding');

            cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, key);
            cipher.update(new java.lang.String(m).getBytes());

            const hash = cipher.doFinal();

            return new java.math.BigInteger(1, hash).toString(16);

        }

        function bvsdformat(uuid, username, password, userAgent) {
            return {
                "a": uuid + "-4",
                "b": "1.3.4",
                "d": [
                    {
                        "i": "id",
                        "b": {
                            "a": [
                                "0," + username
                            ]
                        },
                        "d": username,
                        "e": false,
                        "f": false
                    },
                    {
                        "i": password,
                        "e": true,
                        "f": false
                    }
                ],
                "h": "1f",
                "i": {
                    "a": userAgent
                }
            }
        }

        function generateKeys() {
            const keys = org.jsoup.Jsoup.connect('https://nid.naver.com/login/ext/keys2.nhn').get().text();
            return keys.split(',');
        }

        (function authenticate() {

            this.uuid = java.util.UUID.randomUUID().toString();

            const [
                sessionkey,
                keyname,
                modulusLength,
                exponent
            ] = generateKeys();

            const message = getLenChar(sessionkey) + sessionkey +
                            getLenChar(username) + username +
                            getLenChar(password) + password;
            const encpw = encrypt(modulusLength, exponent, message),
                  bvsd = bvsdformat(this.uuid, this.username, this.password, this.userAgent),
                  encData = LZString.compressToEncodedURIComponent(JSON.stringify(bvsd)),
                  final_bvsd = {
                      uuid: this.uuid,
                      encData: encData
                  };
            
            const response = org.jsoup.Jsoup.connect('https://nid.naver.com/nidlogin.login')
                .userAgent(this.userAgent)
                .method(org.jsoup.Connection.Method.POST)
                .header('Content-Type', 'application/x-www-form-urlencoded')
                .data('encpw', encpw)
                .data('enctp', 1)
                .data('svctype', 1)
                .data('smart_LEVEL', -1)
                .data('bvsd', JSON.stringify(final_bvsd))
                .data('encnm', keyname)
                .data('locale', 'ko_KR')
                .data('url', 'https://naver.com')
                .data('nvlong', logincontinue ? 'on' : 'off')
                .execute();

            if (!response.cookie('NID_AUT')) throw new Error('Login Failed! Check your username or password.');

            Object.assign(this.cookies, {
                nid_inf: response.cookie('nid_inf'),
                NID_AUT: response.cookie('NID_AUT'),
                NID_JKL: response.cookie('NID_JKL'),
                NID_SES: response.cookie('NID_SES')
            });

        }).bind(this)();

        return this;
    }

    /**
     * 
     * handles Error if there is no session
     * @returns this
     */
    Naver.prototype.logout = function () {

        if (this.cookies) throw new Error('You have no session. Please login first.');

        org.jsoup.Jsoup.connect('http://nid.naver.com/nidlogin.logout')
            .cookies(this.cookies)
            .execute();

        return this;

    }

    /**
     * 
     * @param {String} cafeId 
     * @param {String} articleId 
     * @param {String} content
     * @returns result JSON
     */
    Naver.prototype.writeComments = function (cafeId, articleId, content) {
        return org.jsoup.Jsoup.connect('https://apis.naver.com/cafe-web/cafe-mobile/CommentPost.json')
            .userAgent(this.userAgent)
            .method(org.jsoup.Connection.Method.POST)
            .header('Content-Type', 'application/x-www-form-urlencoded')
            .header('X-Cafe-Product', 'pc')
            .data({
                content: content,
                cafeId: cafeId,
                articleId: articleId,
                requestedFrom: 'A'
            }).ignoreContentType(true)
            .execute()
            .body();
    }

    /**
     * 
     * @param {String} cafeId 
     * @param {String} articleId
     * @returns result JSON
     */
    Naver.prototype.deleteArticle = function (cafeId, articleId) {
        return org.jsoup.Jsoup.connect('https://apis.naver.com/cafe-web/cafe2/ArticleDelete.json')
            .userAgent(this.userAgent)
            .method(org.jsoup.Connection.Method.POST)
            .header('Content-Type', 'application/x-www-form-urlencoded')
            .header('X-Cafe-Product', 'pc')
            .data({
                content: content,
                cafeId: cafeId,
                articleId: articleId,
                requestedFrom: 'A'
            }).ignoreContentType(true)
            .execute()
            .body();
    }
}
