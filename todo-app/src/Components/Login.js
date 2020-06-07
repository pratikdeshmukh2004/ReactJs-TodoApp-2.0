import React, { Component } from 'react'
import { Link,Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import {reactLocalStorage} from 'reactjs-localstorage';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBIcon, MDBModalFooter } from 'mdbreact';

class Login extends Component {
    state={
        redirect:"",
        errortext:""
    }
    onlogin=()=>{
        var email=document.getElementById("email").value;
        var pass=document.getElementById("pass").value;
        if (email!=='' && pass!=='' && email.includes("@")){          
            axios.post("http://localhost:8090/checkuser",{email:email,password:pass})
            .then((data)=>{
                if(data.data.result && data.data.pass===pass){  
                    reactLocalStorage.clear()
                    reactLocalStorage.set('token',data.data.token)
                    this.setState({
                        redirect:<Redirect to="/home" />
                    })
                }else{
                    if(data.data.result){
                    this.setState({
                        errortext:"Invalid Email Password..."
                    })
                    }else{
                        this.setState({
                            errortext:"This User Not Exists..."
                        })
                    }
                }
            })
        }else{
            this.setState({
                errortext:"Please Fill The Inputs..."
            })
        }  
    }
    componentWillMount(){
        axios.post("http://localhost:8090/all",{token:reactLocalStorage.get("token")})
            .then((resp)=>{
                if (resp.data.result){
                    this.setState({
                        redirect:<Redirect to="/home" />
                    })
                }else{
                    this.setState({
                        redirect:<Redirect to="/login" />
                     })
                }
            })
    }
    responseGoogle=(result)=>{
      console.log(result);
      
        var userdetail={
            "user":result.profileObj.name,
            "email":result.profileObj.email,
            "password":null
        }
        axios.post("http://localhost:8090/fbgoogle",userdetail)
        .then((res)=>{
            reactLocalStorage.set("token",res.data.token)
            this.setState({
                redirect:<Redirect to="/home" />
            })          
        })
        .catch((err)=>{
            console.log(err);
            
        })     
    }
    responseFacebook=(result)=>{
        var userdetail={
            "user":result.name,
            "email":result.id,
            "password":null
        }
        axios.post("http://localhost:8090/fbgoogle",userdetail)
        .then((res)=>{
            reactLocalStorage.set("token",res.data.token)
            this.setState({
                redirect:<Redirect to="/home" />
            })
        })
        .catch((err)=>{
            console.log(err);
            
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
                      label="Your email Address..."
                      group
                      type="email"
                      id="email"
                      validate
                      error="wrong"
                      success="right"
                    />
                    <MDBInput
                      label="Your password"
                      group
                      type="password"
                      id="pass"
                      validate
                      containerClass="mb-0"
                    />
                    <p className="font-small blue-text d-flex justify-content-end pb-3">
                      Forgot
                      <Link to="/forgotpass" className="blue-text ml-1">

                        Password?
                      </Link>
                    </p>
                    <div className="text-center mb-3">
                      <MDBBtn
                        onClick={this.onlogin}
                        type="button"
                        gradient="blue"
                        rounded
                        className="btn-block z-depth-1a"
                      >
                        Sign in
                      </MDBBtn>
                    </div>
                    <p className="font-small dark-grey-text text-right d-flex justify-content-center mb-3 pt-2">

                      or Sign in with:
                    </p>
                    <hr class="hr-text" data-content="OR"></hr>
                    <div className="row my-2 d-flex justify-content-center">
                    <GoogleLogin
                              clientId="1082822337636-mudl9qsbg7b3te03s8hoqjpgc8op1o0v.apps.googleusercontent.com"
                              buttonText="Login"
                              className='fa-lg m-5 tw-ic'
                              onSuccess={this.responseGoogle}
                              onFailure={this.responseGoogle}
                          />
                      <FacebookLogin
                              appId="2237545999868672"
                              cssClass="facebook"
                              fields="name,email,picture"
                              textButton="  Login"
                              icon={<MDBIcon fab icon="facebook-f" size="lg"  />}
                              // onClick={this.responseFacebook}
                              callback={this.responseFacebook}
                          />
                    </div>
                  </MDBCardBody>
                  <MDBModalFooter className="mx-5 pt-3 mb-1">
                    <p className="font-small grey-text d-flex justify-content-end">
                      Not a member?
                      <Link to="/signup" className="blue-text ml-1">

                        Sign Up
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

export default Login;