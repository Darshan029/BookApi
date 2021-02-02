const express = require('express');
const Book = require('./Model/book');
const router = express.Router();
//for user
const user = require('./Model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//fetch record
router.get("/books",async (req,res)=>{
    const book = await Book.find();
    res.send(book);
});

//insert record
router.post("/books",async(req,res)=>{

    try {
        const book = new Book({
            name:req.body.name,
            qty:req.body.qty
        });
        await book.save();
        res.send(book);
    } catch (error) {
        res.status(404).send(error);
    }
    
});

//update record
router.patch("/books/:id",async(req,res)=>{
    try {
        const book = await Book.findOne({_id:req.params.id});
        book.name=req.body.name;

        await book.save();
        res.send(book);

    } catch (error) {
        res.send(error);
    }
});
//delete record
router.delete("/books/:id",async(req,res)=>{

    try {
        await Book.deleteOne({_id:req.params.id});
        res.send("deleted");
    } catch (error) {
        res.status(404).send({error:"books is not found"});
    }
    
});

//user

router.post('/register',async (req,res)=>{

    const salt = await bcrypt.genSalt(10);
    const hashePswd = await bcrypt.hash(req.body.pswd,salt);

    const user = new User({
        uname:req.body.uname,
        pswd:hashePswd
    })

    await user.save();
    res.send(user);

});

router.post("/login",async (req,res)=>{

    const user = user.findOne({uname:req.body.uname});
    if(!user){
        return res.send("user not found..!");
    }
    else{
        const isValid = bcrypt.compare(req.body.pswd,user.pswd);
        if(!isValid){
            res.send("Wrong Password..!");
        }
        else{
            //res.send("Login Successfully..!");
            const token = jwt.sign({_id:user._id},"privatekey");
            res.header('auth-token',token);
            res.send(token);
        }
    }
});

module.exports = router;