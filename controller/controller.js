var fs = require('fs')
const sharp = require('sharp');
var moment = require('moment');
const gm = require('gm');
moment().format();
const path = require('path');
exports.index = function (req, res) {
  var file = "./data/"+"post"+".json"
  var list = JSON.parse(fs.readFileSync(file))
  var login = false
  var login_account = JSON.parse(fs.readFileSync("./data/loginaccount.json"))
  var found_post = JSON.parse(fs.readFileSync("./data/foundpost.json"))
  login_account.forEach(function (item) {
    if (item.login) {
      login=true
    }
  })
  var account = {}
  if (login) {
    account = {email:login_account[0].email, avatar:login_account[0].avatar}
  }
  res.render('index', {
    title: "Opinion",
    message: "Hi",
    list,
    login,
    account,
    found_post
  });
};
exports.login = function (req, res) {
  res.render('login', {
    title: "Login",
  });
};
exports.register = function (req, res) {
  res.render('register', {
    title: "Register"
  });
};
exports.save = function (req, res) {
  var avatar_photo = "./avatar/default.png"
  if (req.file) {
    sharp(path.resolve() + "/public/avatar/" + req.file.filename)
    .resize(36, 36, "!")
    .toFile(path.resolve() + "/public/avatar/" +"resize-"+ req.file.filename,function(err) {
      if (err) throw err;
    });
    avatar_photo="./avatar/" + "resize-"+ req.file.filename
  }
  var file = "./data/"+"accounts"+".json"
  if (req.body.email && req.body.password) {
    var list = JSON.parse(fs.readFileSync(file, JSON.stringify(data)))
    var data = {email:req.body.email,pass:req.body.password,avatar:avatar_photo}
    list.push(data)
    fs.writeFile (file, JSON.stringify(list), function(err) {
      if (err) throw err;
    });
    res.redirect("/")
  }else{
    res.redirect("/register")
  }
};
exports.save_post = function (req, res) {
  var account = JSON.parse(fs.readFileSync("./data/loginaccount.json", (data)))
  var login = false
  account.forEach(function (item) {
    login=item.login
  })
  if (login) {
    var file = "./data/"+"post"+".json"
    var list = JSON.parse(fs.readFileSync(file, JSON.stringify(data)))
    var account = JSON.parse(fs.readFileSync("./data/loginaccount.json", JSON.stringify(data)))
    var data = {account:account[0].email, post:req.body.post}
    list.push(data)
    fs.writeFile (file, JSON.stringify(list), function(err) {
      if (err) throw err;
    });
    res.redirect("/")
  }else{
    res.redirect("/login")
  }
};
exports.check = function (req, res) {
  var file = "./data/"+"accounts"+".json"
  var list = JSON.parse(fs.readFileSync(file, (data)))
  var data = {email:req.body.email,pass:req.body.password}
  var i = -1
  var index_of_account;
  var check_login = false
  list.forEach(function (item) {
    i++
    if (item.email==req.body.email && item.pass==req.body.password) {
      check_login=true
      index_of_account=i
    }
  })
  if (check_login) {
    var list = JSON.parse(fs.readFileSync(file, (data)))
    var account = []
    var a =list[index_of_account].login=true
    account.push(list[index_of_account])
    fs.writeFile ("./data/loginaccount.json", JSON.stringify(account), function(err) {
      if (err) throw err;
    });
    res.redirect("/")
  }else{
    res.redirect("/login")
  }
}
exports.profile = function (req, res) {
  var account = require('../data/loginaccount.json')
  res.render("profile", {
    profile:account
  })
};
exports.exit = function (req, res) {
  fs.writeFile ("./data/loginaccount.json", JSON.stringify([]), function(err) {
    if (err) throw err;
  });
  res.redirect("/")
};
exports.edit = function (req, res) {
  var loginaccount = JSON.parse(fs.readFileSync("./data/loginaccount.json"))
  console.log(loginaccount[0].avatar);
  res.render("edit", {
    email:loginaccount[0].email,
    pass:loginaccount[0].pass,
    avatar:loginaccount[0].avatar
  })
};
exports.save_edit = function (req, res) {
  var accounts = JSON.parse(fs.readFileSync("./data/accounts.json"));
  var loginaccount = JSON.parse(fs.readFileSync("./data/loginaccount.json"));
  var i = -1
  var index_of_account = "No"
  console.log(req.body);
  var avatar_photo = loginaccount[0].avatar
  console.log( req.body.avatar);
  accounts.forEach(function (item) {
    i++
    if (item.email==loginaccount[0].email && item.pass==loginaccount[0].pass) {
      check_login=true
      index_of_account=i
    }
  })
  if (req.file) {
    sharp(path.resolve() + "/public/avatar/" + req.file.filename)
    .resize(36, 36, "!")
    .toFile(path.resolve() + "/public/avatar/" +"resize-"+ req.file.filename,function(err) {
      if (err) throw err;
    });
    avatar_photo="./avatar/" + "resize-"+ req.file.filename
  }
  console.log(index_of_account);
  accounts[index_of_account].email=req.body.email
  accounts[index_of_account].pass=req.body.pass
  accounts[index_of_account].avatar=avatar_photo
  console.log(accounts);
  var data = {email:req.body.email,pass:req.body.pass,avatar:avatar_photo,login:true}
  fs.writeFileSync("./data/accounts.json", JSON.stringify(accounts));
  fs.writeFileSync("./data/loginaccount.json", JSON.stringify([data]));
  res.redirect("/profile")
};
exports.search = function (req, res) {
  if (req.body.search) {
    console.log(req.body.search);
    var post = JSON.parse(fs.readFileSync("./data/post.json"));
    var i = -1
    var arr = []
    post.forEach(function (item) {
      i++
      if (item.post.match(req.body.search)) {
        arr.push(post[i])
      }
    })
    fs.writeFileSync("./data/foundpost.json", JSON.stringify(arr));
  }
  res.redirect('/')
};
exports.all = function (req, res) {
    fs.writeFileSync("./data/foundpost.json", JSON.stringify([]));
  res.redirect('/')
};
exports.styles_example = function (req, res) {

  res.render("styles_example")
};
