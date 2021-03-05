const express = require("express");
const internetAvailable = require("internet-available");
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

const collectionRouter = require("./routes/collection.js");
const collectionTypeRouter = require("./routes/collectionType.js");
const commentRouter = require("./routes/comment.js");
const itemRouter = require("./routes/item.js");
const likeRouter = require("./routes/like.js");
const userRouter = require("./routes/user.js");
const userRoleRouter = require("./routes/userRole.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use("/collection", collectionRouter);
app.use("/collectionType", collectionTypeRouter);
app.use("/comment", commentRouter);
app.use("/item", itemRouter);
app.use("/like", likeRouter);
app.use("/user", userRouter);
app.use("/userRole", userRoleRouter);
app.use("/view", express.static('./view/'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+'\\view' + '\\index.html'));
})
app.post('/upload', (req,res)=>{
    internetAvailable().then(function(){
       res.end(JSON.stringify({status:'server'}))
    }).catch(function(){
        res.end(JSON.stringify({status:'error'}))
    });
})

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});
app.listen(8000);