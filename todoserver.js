var express = require("express");
var cors = require('cors');
var bodyparser = require("body-parser");
var nodemailer = require('nodemailer');
var knex = require("knex")({
    client: "mysql",
    connection: {
        "host": "localhost",
        "user": "root",
        "password": "pratik",
        "database": "tododata"
    }
})
var jwt = require("jsonwebtoken");
var app = express();
app.use(bodyparser.json());
app.use(cors())
function tablecreater() {
    knex.schema.createTable('users', (table) => {
        table.increments('id')
        table.string('user')
        table.string("email")
        table.string('password')
    })
        .then(() => {
            console.log("user table created...");
            knex.schema.createTable('todos', (table) => {
                table.increments('id')
                table.string('text')
                table.boolean('done')
                table.integer("userid")
            })
                .then(() => {
                    console.log("table created...");
                })
                .catch(() => {

                })
        })
        .catch(() => {

        })
}
tablecreater()
app.post("/all", (req, res) => {
    tablecreater()
    jwt.verify(req.body.token, "lala", (err, tokendata) => {
        if (!err) {
            knex.select("*").from("todos").where("userid", tokendata.id)
                .then((data) => {
                    res.send({ data: data, result: true })
                })
                .catch((err) => {
                    console.log(err);
                    res.send({ result: false })
                })
        } else {
            res.send({ result: false })
        }
    })
})

app.post("/todos", (req, res) => {
    tablecreater()
    jwt.verify(req.body.userid, "lala", (err, tokendata) => {
        if (!err) {
            var bodydata = req.body;
            bodydata.userid = tokendata.id
            knex("todos").insert(bodydata)
                .then((data) => {
                    res.send({ result: true, data: data })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            res.send({ result: false })
        }
    })
})
app.get("/users", (req, res) => {
        knex.select("*").from("users")
            .then((data) => {
                res.send({Count:data.length,Lists:data})
            })
            .catch((err) => {
                console.log(err);
            })
})
app.post("/check", (req, res) => {
    tablecreater()
    console.log('req.body', req.body);
    knex("todos")
        .where("todos.id", req.body.id)
        .update({ done: req.body.done })
        .then((data) => {
            res.send(data.data)
            console.log("done");

        })
        .catch((err) => {
            res.send('err in upupdating done in db', err)
        })
})

app.post("/del", (req, res) => {
    tablecreater()
    console.log(req.body);
    knex.select("*").from("todos").where("id",req.body.id).del()
        .then(() => {
            res.send("deleted")
        })
        .catch((err) => {
            res.send(err)
        })
})
app.put("/edit", (req, res) => {
    tablecreater()
    knex("todos")
        .where("todos.id", req.body.id)
        .update({ text: req.body.text })
        .then(() => {
            console.log("done");

            res.send("doen")
        })
})

app.post("/createuser", (req, res) => {
    tablecreater()
    knex.select("*").from("users").where('email', req.body.email)
        .then((data) => {
            if (data.length > 0) {
                console.log(data);
                res.send({ result: false })
            }
            else {
                knex("users").insert(req.body)
                    .then(() => {
                        res.send({ result: true })
                    })
            }
        })
})
app.post("/checkuser", (req, res) => {
    knex.select("*").from("users").where("email", req.body.email)
        .then((data) => {
            if (data.length > 0) {
                var token = jwt.sign({ id: data[0].id }, 'lala', { expiresIn: '5h' })
                res.send({ result: true, pass: data[0].password, token: token })
            }
            else {
                res.send({ result: false })
            }
        })
})
app.post("/getuser", (req, res) => {
    tablecreater()
    console.log(req.body);
    
    jwt.verify(req.body.token, "lala", (err, tokendata) => {        
        if (!err) {
            console.log(tokendata);
            
            knex.select("*").from("users").where("id", tokendata.id)
                .then((data) => {
                    console.log(tokendata);

                    res.send({ result: true, data: data[0] })
                })
        } else {
            res.send({ result: false })
        }
    })
})
app.post("/fbgoogle", (req, res) => {
    knex.select("*").from("users").where("email", req.body.email)
        .then((result) => {
            if (result.length > 0) {
                console.log(result);
                var token = jwt.sign({ id: result[0].id }, "lala")
                res.send({ token: token })
            } else {
                knex("users").insert(req.body)
                    .then((data) => {
                        console.log("id", data[0]);
                        var token = jwt.sign({ id: data[0] }, "lala")
                        res.send({ token: token })
                    })
            }
        })

})

app.post('/forgetpass', (req, res) => {
    knex.select("*").from("users").where('email', req.body.email)
        .then((result) => {
            if (result.length > 0) {
                var token = jwt.sign({ id: result[0].id }, "lala")
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'pratikbekar@gmail.com',
                        pass: 'Pratik@123'
                    }
                });

                var mailOptions = {
                    from: 'pratik18@navgurukul.org',
                    to: req.body.email,
                    subject: 'Reset Password Of Todo App.',
                    text: 'http://localhost:8080/forgetpass?' + token,
                    html: '<center><div style="background-color: #e5e5e5;width: 50%;padding: 30px;"><h1 style="color: green;text-align: center;">Reset Password</h1><p>Seems like you forgot your password for Todo app If this is true,click below to reset your password.This is Valid For 1 Hour.</p><a href="http://localhost:3000/resetpass?' + token + '" style="background-color: blue; color: white;border: none;padding: 5px;font-size: 20px; text-decoration: none;">Reset Password</a><p>If you did not forgot your password you can safly ignore this mail.</p><p style="text-align: left;">Thank you</p></div></center>'
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                console.log(token);

                res.send({ result: true })
            } else {
                res.send({ result: false })
            }
        }).catch((err) => {
            console.log(err);
        })

})
app.post('/resetpass',(req,res)=>{
    jwt.verify(req.body.token, "lala", (err, tokendata) => {        
        if (!err) {
            knex("users").update({password:req.body.password}).where("id",tokendata.id)
            .then((data)=>{
                res.send({result:true})
            })
        }
    })
    
})

app.listen(8080)