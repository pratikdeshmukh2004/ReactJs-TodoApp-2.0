import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import SweetAlert from 'react-bootstrap-sweetalert';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter } from 'mdbreact';
import qs from 'query-string';

export class Reset extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errortext: "",
            alert: false,
            user: "",
            email: ""
        }
    }


    componentWillMount() {
        axios.post("http://localhost:8090/getuser", { token: (window.location.search).slice(1) })
            .then((resp) => {
                if (!resp.data.result) {
                    this.setState({
                        redirect: <Redirect to="/login" />
                    })
                } else {
                    this.setState({
                        user: resp.data.data.user,
                        email: resp.data.data.email
                    })

                }


            })
    }
    onreset = () => {
        var pass=document.getElementById("passw").value;
        var retry=document.getElementById("passw2").value;
        if (pass=="" && retry==""){
            this.setState({
                errortext:"Please Fill Empty Inputs..."
            })
        }else{
            if (pass!==retry){
                this.setState({
                        errortext:"Please Check Your Confirm Password..."
                    })
            }else{
                axios.post("http://localhost:8090/resetpass", { token: (window.location.search).slice(1),password:pass})
                .then((resp) => {
                    if (resp.data.result){
                        this.setState({
                            alert:true
                        })
                        
                    }
                })
                .catch(()=>{
                    this.setState({
                        errortext:"Sorry 505 Error Found..."
                    })
                })
            }
        }
    }
    render() {
        return (
            <div className="login">
                {this.state.redirect}
                <SweetAlert
                    success
                    show={this.state.alert}
                    onConfirm={()=>this.setState({alert:false,redirect:<Redirect to="/login"/>})}
                >
                    <h3>Reset Password successfully...</h3>
                </SweetAlert>
                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="8">
                            <MDBCard>
                                <MDBCardBody className="mx-5">
                                    <div className="text-center">
                                        <h3 className="dark-grey-text mb-3">
                                            <strong>Reset Password</strong>
                                        </h3>
                                    </div>
                                    <h5>Welcome {this.state.user}</h5>
                                    <h6>Reset the Password of your email ({this.state.email})</h6>
                                    <p style={{ color: "red" }}>{this.state.errortext}</p>
                                    <MDBInput
                                        label="New password"
                                        group
                                        type="password"
                                        id="passw"
                                        validate
                                        containerClass="mb-0"
                                    />
                                    <MDBInput
                                        label="Confirm password"
                                        group
                                        type="password"
                                        id="passw2"
                                        validate
                                        containerClass="mb-0"
                                    />

                                    <div className="text-center mb-3">
                                        <MDBBtn
                                            onClick={this.onreset}
                                            type="button"
                                            gradient="blue"
                                            rounded
                                            className="btn-block z-depth-1a"
                                        >
                                            reset
                                        </MDBBtn>
                                    </div>
                                </MDBCardBody>
                                <MDBModalFooter className="mx-5 pt-3 mb-1">
                                    <p className="font-small grey-text d-flex justify-content-end">
                                        Have an Account?
                                    <Link to="/login" className="blue-text ml-1">

                                            Log In
                                    </Link>
                                    </p>
                                </MDBModalFooter>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </div>
            // <div className="card">
            //     <p>{this.state.errortext}</p>
            //     <SweetAlert
            //         success
            //         show={this.state.alert}
            //         onConfirm={()=>this.setState({alert:false})}
            //     >
            //         <h3>Reset Password successfully...</h3>
            //     </SweetAlert>
            //     {this.state.redirect}
            //     <h1>Reset Your Password</h1>
            //     <span>
            //         <h3>Password</h3>
            //         <input required id="passw" type="password" placeholder="Your Password..."/>
            //     </span>
            //         <br></br>
            //         <span>
            //         <h3>Re-enter Password</h3>
            //         <input onChange={this.onpassword} required id="passw2" type="password" placeholder="Your Password..."/>
            //     </span>
            //         <br></br>
            //         <button className="Next" type="submit" onClick={this.onreset }> Signup </button>                  <br></br>
            // </div>
        )
    }
}

export default Reset;
