## 引言
登录，这是一个几乎所有网站都有的功能，是一个我们再熟悉不过、却也很容易忽视的功能。用户，或许是一个公司最重要的资产，而登录，是提高用户粘性、为用户提供更好服务的第一道门槛。做好登录这个功能，或许并不是我们想象中的那么简单，易用性、安全性都是需要考虑的隐私。那么，一个好的登录功能，应该考虑什么呢？
1. session。不要认为用户会有耐心一天在同一个网站输入三次账号密码。
2. 安全。好几年前，CSDN的数据库就曾被黑，爆出600万条明文账号密码。
3. 认证方式。是采用传统的输入账号密码登录，还是采用OpenID或OAuth？
这篇文章首先将介绍关于cookie和session、简单的加密和认证相关的知识，再应用这些知识，完成两个登录功能demo：[local-login](https://github.com/weaponhe/demo-platform/tree/master/local-login)和[github-oauth2-login](https://github.com/weaponhe/demo-platform/tree/master/github-oauth2-login)。

### cookie和session
在一个概念或技术的时候，我们首先需要考虑的是：为什么要用这个技术？这个技术解决的是什么问题？

#### cookie
那么，为什么会出现cookie这个技术？cookie解决的是什么问题？
cookie出现的原因是HTTP协议最初是一个匿名、无状态的请求/响应协议。服务器处理来自客户端的请求，然后向客户端会送一条响应。Web服务器几乎没有什么信息可以用来判定是哪个用户发送的请求，也无法记录来访用户的请求序列。因此cookie出现了，用来解决客户端识别的问题。现代的Web站点希望提供个性化的体验，如个性化的推荐等。
cookie只是客户端识别技术的一种，本文的主题不是讨论客户端识别，因此其他客户端识别技术诸如HTTP首部、客户端IP地址追踪、胖URL等等我们将不深入介绍。
事实上，cookie只不过是一个存储在客户端的文本文件，里面包含几种数据：
1. 一个存储数据的name-value对
2. 一个过期时间expiry date
3. 决定浏览器往哪里发送的domain和path

如果某个cookie的domain和path指向你所访问的服务器，那么这个cookie的数据就会被添加到HTTP header，接着服务器端程序就会读取这些数据然后决定你是否有访问这个页面的权限或你的页面应该是蓝色的还是黄色的，这个流程分为如下几步：
1. 服务器向客户端发送 cookie。通常使用 HTTP 协议规定的 set-cookie 头操作。规范规定 cookie 的格式为 `name = value` 格式，且必须包含这部分。
2. 浏览器将 cookie 保存到上述的那个文本文件中。
3. 每次请求浏览器都会将 cookie 发向服务器。
express中通过cookie-parser这个中间件操作cookie，下面给出一个简单例子：
```js
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.listen(3000);
app.use(cookieParser());

app.get('/', function (req, res) {
    if (req.cookies.isVisit) {
        res.send("再次欢迎访问");
    } else {
        res.cookie('isVisit', 1, {maxAge: 60 * 1000});
        res.send("欢迎第一次访问");
    }
});
```

#### session
我们来重复一下那个问题：为什么会出现session？session解决的是什么问题？
cookie存在着很大的弊端，正如上面所说，cookie实际上是一个存储在客户端的文本文件，因此中的数据在客户端中就可以被修改，一些重要的内容不能放在cookie中。其次，cookie的数据会伴随着每一次请求传输到服务器端，如果cookie中存储的数据量太大，无疑会大大降低传输效率。因此，session出现了。session将数据存储在服务器端，只产生一个1024比特长的随机字符串存储在cookie中，服务器通过这个字符串来查找储存在服务器端的数据，从而达到客户端识别的目的。session的数据可以存储在内存或缓存中，也可存储在数据库中，这个根据需求来选择。
express中通过express-session这个中间件操作session，下面给出一个简单例子：
```js
var express = require('express');
var session = require('express-session');

var app = express();
app.listen(3000);
app.use(session({
  secret: 'keyboard cat',
  cookie: { maxAge: 60 * 1000 }
}));

app.get('/', function (req, res) {
  if(req.session.isVisit) {
    req.session.isVisit++;
    res.send('<p>第 ' + req.session.isVisit + '次来此页面</p>');
  } else {
    req.session.isVisit = 1;
    res.send("欢迎第一次来这里");
    console.log(req.session);
  }
});
```

### 密码加密
为了提高登录功能的安全性，我们需要对用户的密码进行加密。安全定义是多维度的，通过不可逆的hash算法可以保证登陆密码的安全；通过非对称的加密算法，可以保证数据存储的安全性；通过数字签名，可以验证数据在传输过程中是否被篡改。
Node.js内置的Crypto库可以使我们很方便地对密码进行加密和解密。如果安全性要求更高可以使用bcrypt库。

>The crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions.

```js
const crypto = require('crypto');

const md5 = crypto.createHash('md5');
md5.update('password')
md5res = md5.digest('hex');
console.log(md5res);
```

### 登录验证方式
常用的认证方式有下面几种：
- 账号密码:这是最传统的登录验证方式。用户通过输入账号密码进行登录，服务器通过账号查找密码进行比对从而对用户进行验证。
- OpenID:OpenID是让第三方网站认证用户身份，比如使用QQ账号去登录QQ邮箱、QQ音乐等等其他应用。OpenID的作用是 authentication (proving who you are)。
- OAuth:OAuth（开放授权）是一个开放标准，允许用户让第三方应用访问该用户在某一网站上存储的私密的资源（如照片，视频，联系人列表），而无需将用户名和密码提供给第三方应用。Oauth的作用是 authorisation。

我们重点来聊一下OAuth2.0是如何工作的，[stackoverflow](http://stackoverflow.com/questions/4113934/how-is-oauth-2-different-from-oauth-1)有个特别好的例子：

> I was driving by Olaf's bakery on my way to work and I saw the most delicious donut in the window, I mean the thing was dripping chocolatey goodness. So I went inside and demanded "I must have that donut!". He said sure that will be $30.
>
>Yeah I know $30 for one donut! It must be delicious! I reached for my wallet when suddenly I hear the chef yell "NO! No donut for you". I asked why? He said he only accepts bank transfers.
 >
 >Seriously? Yep, he was serious. I almost walked away right there, but then the donut called out to me. It said "Eat me, I'm delicious..." Who am I not to obey the orders of a donut.
 >
 >So I said ok. He hands me a note with his name on it (the chef not the donut), "Tell them Olaf sent you". He wrote his name on the note, I don't know why he said that, but ok.
 >
 >So I drive an hour and a half to my bank. I hand the note to the cashier, I tell her Olaf sent me. She gives one of those looks, the kind of look that says "I can read".
 >
 >She takes my note, asks for my id, then asks me how much money is ok to give him. I tell her $30 dollars. She does some scribbling and hands me another note. This one has a bunch of numbers on it, I guess that's how they keep track of the notes.
 >
 >At this point I'm starving. I rush out of there, an hour and a half later I'm standing in front of Olaf with my hand extended to his face. He takes my note, looks it over and says "I'll be back".
 >
 >I thought he was getting my donut, but after 30 minutes I started to get suspicious. So I asked the guy behind the counter "Where's Olaf?". He says "He went to get money". "What do you mean?", "He take note to bank".
 >
 >Huh. So Olaf took the note that the bank gave me and went back to the bank to take out money from my account. Because he has the note that the bank gave me, the bank knows he's the guy I was talking about. And they know to only give him $30 because I told them that's all I would allow them to give him.
 >
 >It must have took me a long time to figure that out because by the time I looked up there was Olaf standing in front of me finally handing me my donut. Before I left I had to ask "Olaf, did you always sell donuts this way?", "No, I used to do it different."
 >
 >Huh. As I walked to the car my phone rings. I didn't bother answering, it was probably my job calling to fire me, my boss is such a ***. Besides I was caught up thinking about this whole process I just went through.
 >
 >I mean think about it, I was able to let Olaf take $30 out of my bank account without having to give him my account information. And I didn't have to worry that he would take too much because I already told the bank he was only allowed to take $30. And the bank knew he was the right guy because he had the note they gave me and I gave to Olaf.
 >
 >Ok, sure I would rather have given him $30 from my pocket. But now that he has that note I could just tell the bank to let him withdraw $30 each week, then I can just show up at the bakery and I don't have to go to the bank anymore. I could even order the donut by phone.
 >
 >Of course I'd never do that - that donut was disgusting.
 >
 >I wonder if this approach has broader application. He mentioned this was his second approach, I could call it Olaf 2.0. Anyway I better get home, I gotta start looking for a new job. But not before I get one of those strawberry shakes from that new place across town, I need something to wash away that taste of that donut.


下面分别针对账号密码方式和OAuth，使用Passportjs实现登录功能。首先是账号密码方式：
```js
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function (username, password, done) {
    if (username != 'foo') {
        return done(null, false);
    }
    if (password != '123456') {
        return done(null, false);
    }
    return done(null, {username: username});
}));

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

app.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});
app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        console.log(req.user);
        res.redirect('/');
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000);
```

接着使用passport-github来实现OAuth2.0登录功能：

```js
var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = "b21159b60dc743233a34";
var GITHUB_CLIENT_SECRET = "d75300f9e1f44e245a53e03fbf8400aeb713da85";

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

var app = express();
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

app.get('/account', function (req, res) {
    res.render('account', {user: req.user});
});

app.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});

app.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/github',
    passport.authenticate('github'),
    function (req, res) {
    }
);

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    }
);

app.listen(3000);


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
```