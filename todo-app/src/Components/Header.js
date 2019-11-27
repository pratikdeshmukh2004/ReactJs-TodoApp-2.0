import React from 'react';
import { Pie } from "react-chartjs-2";
import { reactLocalStorage } from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MDBBadge,MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBIcon, MDBInput, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBAvatar } from "mdbreact";
import { Fragment } from "react";
import { Navbar, Nav,Form,FormControl,Button,Modal } from 'react-bootstrap';
class Head extends React.Component {
    state = ({
        item: "",
        open: false,
        user: "",
        email: ""
    })
    onChangeHandler = (e) => {
        this.setState({
            item: e.target.value
        })
        // console.log(this.state.item);

    }
    onEnter = (e) => {
        if (e.key === 'Enter' && this.state.item !== "") {
            var con = false;
            var lettrs = this.state.item
            lettrs = lettrs[0].toUpperCase() + lettrs.slice(1)

            for (var i of lettrs) {
                if (i !== null && i !== " ") {
                    con = true

                }
            }
            if (con) {
                this.props.getdata(lettrs)
                this.setState({
                    item: ""
                })
            }
        }
    }
    onchangec = (e) => {
        if (e.target.id === "1") {
            this.props.activate(0)
        } else if (e.target.id === "2") {
            this.props.activate(1)
        } else if (e.target.id === "3") {
            this.props.activate(2)
        }

    }
    toggle = () => {
        this.setState({
            open: !this.state.open
        })
    }
    onlogout = () => {
        reactLocalStorage.clear()

    }
    componentWillMount = () => {
        console.log(this.props.statedata);

        axios.post("http://localhost:8080/getuser", { token: reactLocalStorage.get("token") })
            .then((data) => {
                if (data.data.result) {


                    this.setState({
                        user: data.data.data.user,
                        email: data.data.data.email
                    })
                } else {

                }
            })
    }
    toggleCollapse = () => {
        this.setState({ open: !this.state.open });
    }
    render() {

        return (
            <div>
                <Navbar fixed="top" bg="danger" expand="lg">
                    <Navbar.Brand href="#home">
                        <strong className="white-text"><b>To Do</b></strong>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">
                                <MDBNavLink onClick={this.onchangec} id="1" to="#home"><MDBIcon icon="home" /> Home <MDBBadge color="success" >{this.props.totaltodo}</MDBBadge></MDBNavLink>
                            </Nav.Link>
                            <Nav.Link href="#pending">
                                <MDBNavLink onClick={this.onchangec} id="2" to="#pending"><MDBIcon icon="square" /> Pendding <MDBBadge color="success" >{this.props.pentodo}</MDBBadge></MDBNavLink>
                            </Nav.Link>
                            <Nav.Link href="#home">
                                <MDBNavLink onClick={this.onchangec} id="3" to="#done"><MDBIcon icon="check-square" /> Done <MDBBadge color="success" >{this.props.donetodo}</MDBBadge></MDBNavLink>
                            </Nav.Link>
                        </Nav>
                        <Nav><MDBNavbarNav id="user" right>
                            <MDBIcon onClick={this.toggle} size="2x" className="white-text" icon="user-circle" />
                        </MDBNavbarNav></Nav>
                    </Navbar.Collapse>
                </Navbar>
                <br/><br/>
                <MDBInput value={this.state.item} onKeyPress={this.onEnter} onChange={this.onChangeHandler} hint="Add New To Do..." id="input" className="mx-auto w-responsive mt-5" />

                <MDBContainer>
                    <Modal show={this.state.open} onHide={this.toggleCollapse}>
                        <MDBModalHeader className="danger-color" toggle={this.toggle}>Profile</MDBModalHeader>
                        <MDBModalBody>
                            <MDBIcon size="8x" className="user" icon="user-secret" />
                            <h3 className="text-center text-uppercase"><b>{this.state.user}</b></h3>
                            <p className="text-center blue-text">{this.state.email}</p>
                            <MDBContainer>
                                <h3 className="mt-5 text-center">To Do Chart</h3>
                                <Pie data={{
                                    labels: ["Pending", "Done", "Total"],
                                    datasets: [
                                        {
                                            data: [this.props.pentodo, this.props.donetodo, this.props.totaltodo],
                                            backgroundColor: [
                                                "#F7464A",
                                                "#46BFBD",
                                                "#FDB45C",
                                                "#949FB1",
                                                "#4D5360",
                                                "#AC64AD"
                                            ],
                                            hoverBackgroundColor: [
                                                "#FF5A5E",
                                                "#5AD3D1",
                                                "#FFC870",
                                                "#A8B3C5",
                                                "#616774",
                                                "#DA92DB"
                                            ]
                                        }
                                    ]
                                }} options={{ responsive: true }} />
                            </MDBContainer>
                        </MDBModalBody>

                        <MDBModalFooter>
                            <Fragment>
                                <Link to="/login"><MDBBtn onClick={this.onlogout} rounded outline gradient="aqua">Logout <MDBIcon icon="sign-out-alt" /></MDBBtn></Link>
                            </Fragment>
                        </MDBModalFooter>
                    </Modal>
                </MDBContainer>
            </div>
        )
    }
}
export default Head;