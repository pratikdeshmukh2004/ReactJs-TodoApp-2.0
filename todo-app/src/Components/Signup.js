import React, { Component } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Redirect } from 'react-router';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter } from 'mdbreact';

class Signup extends Component {
    state={
        redirect:"",
        errortext:""
    }
    onsignup=()=>{
        var user=document.getElementById("userid").value;
        var email = document.getElementById("emailid").value;
        var pass=document.getElementById("passw").value;
        var retry=document.getElementById("passw2").value;
        if (user !=="" && email!=='' && pass!=='' && email.includes("@") && retry===pass){
            axios.post('http://localhost:8080/createuser',{user:user,email:email,password:pass})
            .then((data)=>{
                if (data.data.result===false){
                    this.setState({
                        errortext:"This user already exists..."
                    })
                }else{
                    this.setState({
                        redirect:<Redirect to='/Login' />
                    })
                }
            })
            .catch((err)=>{
                console.log("err");
            })
        }else{
            if (retry!==pass){
                this.setState({
                    errortext:"Invalid Password..."
                })
            }else{
                this.setState({
                    errortext:"Please Fill Empty Inputs..."
                })
            }
        }  
        
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
                        redirect:<Redirect to="/signup" />
                     })
                }
            })
    }
    render() {
        return (
            <div className="login">
                {this.state.redirect}
            <MDBContainer>
            <MDBRow>
                <MDBCol md="8">
                <MDBCard>
                    <MDBCardBody className="mx-5">
                    <div className="text-center">
                        <h3 className="dark-grey-text mb-3">
                        <strong>Sign in</strong>
                        </h3>
                    </div>
                    <p style={{color:"red"}}>{this.state.errortext}</p>
                    <MDBInput
                        label="Your Name..."
                        group
                        type="text"
                        id="userid"
                        validate
                        error="wrong"
                        success="right"
                    />
                    <MDBInput
                        label="Your email Address..."
                        group
                        type="email"
                        id="emailid"
                        validate
                        error="wrong"
                        success="right"
                    />
                    <MDBInput
                        label="Your password"
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
                        onClick={this.onsignup}
                        type="button"
                        gradient="blue"
                        rounded
                        className="btn-block z-depth-1a"
                        >
                        Sign Up
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
        )
    }
}

export default Signup;