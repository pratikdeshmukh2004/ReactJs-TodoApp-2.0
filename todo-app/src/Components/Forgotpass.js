import React, { Component } from 'react'
import { Redirect } from 'react-router';
import axios from 'axios';
import {reactLocalStorage} from 'reactjs-localstorage';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter } from 'mdbreact';

export class Forgotpass extends Component {
    state={
        errortext:"",
        alert:false
    }
    componentWillMount(){
        axios.post("http://localhost:8080/all",{token:reactLocalStorage.get("token")})
            .then((resp)=>{
                if (resp.data.result){
                    this.setState({
                        redirect:<Redirect to="/home" />
                    })
                }else{
                    this.setState({
                        redirect:<Redirect to="/forgotpass" />
                     })
                }
            })
    }
    onForget=()=>{
        axios.post("http://localhost:8080/forgetpass",({email:document.getElementById("email").value}))
        .then((data)=>{
            if (data.data.result){
                this.setState({
                    alert:true
                })
            }else{
                this.setState({
                    errortext:"This User Not Exists Please Signup..."
                })
            }
        })
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
                    <h3>Reset Password From your Mail...</h3>
                </SweetAlert>
            <MDBContainer>
            <MDBRow>
                <MDBCol md="8">
                <MDBCard>
                    <MDBCardBody className="mx-5">
                    <div className="text-center">
                        <h3 className="dark-grey-text mb-3">
                        <strong>Forgot Password</strong>
                        </h3>
                    </div>
                    <p style={{color:"red"}}>{this.state.errortext}</p>
                    <MDBInput
                        label="Your email Address..."
                        group
                        type="email"
                        id="email"
                        validate
                        error="wrong"
                        success="right"
                    />
                    <div className="text-center mb-3">
                        <MDBBtn
                        onClick={this.onForget}
                        type="button"
                        gradient="blue"
                        rounded
                        className="btn-block z-depth-1a"
                        >
                        Get
                        </MDBBtn>
                    </div>
                    </MDBCardBody>
                    <MDBModalFooter className="mx-5 pt-3 mb-1">
                    <p className="font-small grey-text d-flex justify-content-end">
                    You Got It?
                        <Link to="/login" className="blue-text ml-1">

                        Go Back
                        </Link>
                    </p>
                    </MDBModalFooter>
                </MDBCard>
                </MDBCol>
            </MDBRow>
            </MDBContainer>
            </div>
        )
    }
}

export default Forgotpass;
