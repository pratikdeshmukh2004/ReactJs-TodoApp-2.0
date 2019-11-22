import React, { Component } from 'react';
import './App.css';
import Head from './Components/Header';
import Data from './Components/Home';
import Login from './Components/Login';
import Forgotpass from './Components/Forgotpass'
import Signup from './Components/Signup';
import Resetpass from './Components/Resetpass';
import axios from 'axios';
import {  Route, BrowserRouter as Router } from 'react-router-dom'
import { reactLocalStorage } from 'reactjs-localstorage';
import { Redirect } from 'react-router';

export class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            All: [],
            current: [],
            active: 0,
            editId: null,
        }
    }
    getdata = (itemdata) => {
        axios.post("http://18.220.186.45:8090/todos", { text: itemdata, done: false, userid: reactLocalStorage.get("token") })
            .then((resp) => {
                // console.log('post method in frontend',resp);
                axios.post("http://18.220.186.45:8090/all", { token: reactLocalStorage.get("token") })
                    .then((resp) => {
                        if (resp.data.result) {
                            this.setState({
                                All: resp.data.data,
                                editId: null,
                                redirect: <Redirect to="/home" />
                            })
                            console.log(this.state.All);
                            
                            this.activate(this.state.active)
                        } else {
                            this.setState({
                                redirect: <Redirect to="/login" />
                            })
                        }
                    })
            })
            .catch((err) => {
                console.log('err in post mthod in frontend', err);

            })
    }
    activate = (num) => {
        this.tockencheck()
        var count=0
        var Done=this.state.All.map((dic)=>{
            if (dic.done){
                count+=1
                return count
                
            }
            
        })
        var newlist = []
        if (num === 2) {
            for (var i of this.state.All) {
                if (i.done) {
                    newlist.unshift(i)
                }
            }
        } else if (num === 1) {
            for (i of this.state.All) {
                if (!i.done) {
                    newlist.unshift(i)
                }
            }
        } else {
            for (i of this.state.All) {
                newlist.unshift(i)
            }
        }
        this.setState({
            active: num,
            current: newlist,
            done:count
        })
    }
    tockencheck = () => {
        axios.post("http://18.220.186.45:8090/all", { token: reactLocalStorage.get("token") })
        .then((resp) => {
            if (resp.data.result) {
                this.setState({
                    All: resp.data.data,
                    redirect:<Redirect to="/home" />
                })
                this.activate(this.state.active)
            } else {
                this.setState({
                    redirect: <Redirect to="/login" />
                })
            }
        })
        .catch((err) => {
            console.log("done")
            this.setState({
                redirect:<Redirect to="/login" />
            })

        })

    }
    oncheck = (id) => {
        this.tockencheck()
        var data = this.state.All;
        for (var i of data) {
            if (i.id == id) {
                if (i.done) {
                    i.done = 0

                } else {
                    i.done = 1
                }
                // console.log(i);

                axios.post("http://18.220.186.45:8090/check", i)
                    .then(() => {
                        console.log("done");

                        this.setState({
                            All: data
                        })
                        this.activate(this.state.active)
                    })
                    .catch((err) => {
                        console.log(err);

                    })
            }
        }
    }
    ondelete = (id) => {
        // console.log(id);
        this.tockencheck()
        axios.post("http://18.220.186.45:8090/del", { id: id })
            .then((resp) => {
                // console.log("deleted");
                axios.post("http://18.220.186.45:8090/all", { token: reactLocalStorage.get("token") })
                    .then((resp) => {
                        // console.log(resp.data);

                        this.setState({
                            All: resp.data.data,
                            editId: null
                        })
                        this.activate(this.state.active)
                    })
            })
            .catch((err) => {
                console.log(err);

            })
    }
    ondouble = (id) => {
        this.tockencheck()
        this.setState({
            editId: id
        })
    }
    onedit = (t) => {
        this.tockencheck()
        axios.put("http://18.220.186.45:8090/edit", { text: t, id: this.state.editId })
            .then(() => {
                console.log(t);
                this.setState({
                    editId: null
                })
                axios.post("http://18.220.186.45:8090//all", { token: reactLocalStorage.get("token") })
                    .then((resp) => {
                        this.setState({
                            All: resp.data.data,
                        })
                        this.activate(this.state.active)
                    })
            })
    }
    componentWillMount(){
        this.tockencheck()
    }
    render() {
        return (
            <Router>
                {this.state.redirect}
                <Route exact path="/" render={(props) => <Login />} />
                <Route path="/forgotpass/" render={(props) => <Forgotpass />} />
                <Route path="/resetpass/" render={(props) => <Resetpass />} />
                <Route path="/signup/" render={(props) => <Signup />} />
                <Route path="/login/" render={(props) => <Login />} />
                <Route path="/home/" render={(props) => <div><Head donetodo={this.state.done} pentodo={this.state.All.length-this.state.done} totaltodo={this.state.All.length} getdata={this.getdata} activate={this.activate} /><Data handlereload={this.tockencheck} ondelete={this.ondelete} ondouble={this.ondouble} oncheck={this.oncheck} onedit={this.onedit} List={this.state} /></div>} />
            </Router>
        )
    }
}

export default App
