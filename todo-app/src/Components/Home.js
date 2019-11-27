import React, { Component } from 'react'
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Redirect } from 'react-router';
import { MDBCard, MDBCardBody, MDBInput, MDBContainer, MDBFooter, MDBIcon } from "mdbreact";

class Data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: "",
            redirect: null
        }
    }
    componentWillMount() {
        this.props.handlereload()
        axios.post("http://localhost:8080/all", ({ token: reactLocalStorage.get("token") }))
            .then((resp) => {
                if (resp.data.result) {
                    this.setState({
                        redirect: <Redirect to="/home" />
                    })
                } else {
                    this.setState({
                        redirect: <Redirect to="/login" />
                    })
                }
            })
    }
    onchengehandular = (e) => {
        this.setState({
            edit: e.target.value
        })
    }
    oncheck = (e) => {
        this.props.oncheck(e.target.id)

    }
    ondelete = (e) => {
        this.props.ondelete(e.target.id)
        this.setState({
            edit: ""
        })
        this.props.ondouble(null)
    }
    ondouble = (e) => {
        if (this.props.List.editId == null) {
            for (var i of this.props.List.current) {
                if (i.id == e.target.id) {
                    this.setState({
                        edit: i.text
                    })
                }
            }
            this.props.ondouble(e.target.id)
        }

    }
    onEnter = (e) => {
        var con = false;
        for (var i of e.target.value) {
            if (i !== null && i !== " ") {
                con = true

            }
        }
        if (e.key === 'Enter' && con) {
            this.props.onedit(e.target.value)
            this.setState({
                edit: ""
            })
        }
    }
    render() {
        return (
            <div>
                <div className="w-responsive  mx-auto">
                    {this.props.List.current.map((item, index) => {
                        if (item.id == this.props.List.editId) {
                            return (<MDBCard key={index} className="mt-3 info-color white-text">
                                <MDBCardBody id={item.id} onDoubleClick={this.ondouble} title="Press Enter To Save...">
                                    <input type="checkbox" id={item.id} className="checkbox" title="Done To Do" onClick={this.oncheck} checked={item.done} />
                                    <MDBInput value={this.state.edit} id="input" onKeyPress={this.onEnter} onChange={this.onchengehandular} hint="Edit New To Do..." className="mx-auto white-text" />
                                    <MDBIcon onClick={this.ondelete} icon="trash" id={item.id} title="Delete" className="del" />
                                </MDBCardBody>
                            </MDBCard>)
                        } else {
                            return (<MDBCard key={index} className="mt-3 success-color white-text">
                                <MDBCardBody id={item.id} onDoubleClick={this.ondouble} title="Double Click To Edit...">
                                    <input type="checkbox" id={item.id} className="checkbox" title="Done To Do" onClick={this.oncheck} checked={item.done} />
                                    <b id="b" className="p-5">{item.text}<MDBIcon onClick={this.ondouble} icon="edit" id={item.id} title="Edit" className="del" /><MDBIcon onClick={this.ondelete} title="Delete" icon="trash" id={item.id} className="del" />
                                    </b></MDBCardBody>
                            </MDBCard>
                            )

                        }
                    })
                    }
                </div>
            </div>
        )
    }
}

export default Data;
