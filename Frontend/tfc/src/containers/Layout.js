import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {useSelector} from "react-redux";
import tfc_adobe_express from '../tfc_adobe_express.svg';
// import SearchBar from 'material-ui-search-bar';
import Search from './SearchBar';
import SearchClassBar from "./SearchClassBar";

const { Header, Content, Footer } = Layout;

function IsHome() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    isHomepage
  );
}
const userID = localStorage.getItem("userid");
function IsMe() {
  const location = useLocation();
  const isMe = location.pathname === `/user/${userID}`;

  return (
    isMe
  );
}

function IsClass() {
  const location = useLocation();
  const isClass = location.pathname === '/user/myclasses';

  return (
    isClass
  );
}


const CustomLayout = (props) => {
    const token = localStorage.getItem("access_token");
    const userID = localStorage.getItem("userid");
    localStorage.setItem("HomePageUrl", "http://localhost:3000/")
    return (
        <Layout>
            <Header style={{position: 'sticky', top: 0, zIndex: 1, width: '100%'}}>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    style={{lineHeight: '64px'}}
                >
                    <Menu.Item key="1">
                        <Link to="/">HomePage</Link>
                    </Menu.Item>

                    {

                        token ?
                            <>
                                <Menu.Item key="4">
                                    <Link to="/logout">Logout</Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    {!IsMe() && <a href={`user/${userID}`} >User Details</a>}
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Link to="/updateUser">Update User Info</Link>
                                </Menu.Item>
                            </>

                            :
                            <>
                                <Menu.Item key="2">
                                <Link to="/login">Login</Link>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Link to="/register">Register</Link>
                                </Menu.Item>
                            </>
                    }

                    <Menu.Item key="6" style={{ marginTop: '10px' }}>
                        <div>
                            {IsHome() && <Search />}
                        </div>
                    </Menu.Item>

                    <Menu.Item key="7" style={{ marginTop: '10px' }}>
                        <div>
                            {IsClass() && <SearchClassBar />}
                        </div>
                    </Menu.Item>


                </Menu>
                <div>
                    <img style={{ width: '100px', height: '100px' }} src={tfc_adobe_express} alt="Toronto Fitness Club" />
                </div>
            </Header>
            <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    {!IsClass() && <Breadcrumb.Item><Link to="/filter">Studio Filter</Link> </Breadcrumb.Item>}
                    {!IsClass() && <Breadcrumb.Item><Link to="/payment">Subscription</Link> </Breadcrumb.Item> }
                    {IsHome() && <Breadcrumb.Item><Link to="/shownearest"> Nearest Studio </Link> </Breadcrumb.Item>}
                    {token && <Breadcrumb.Item><Link to="/viewcourses"> Classes </Link> </Breadcrumb.Item>}
                </Breadcrumb>

                <div className="site-layout-background" style={{padding: 24, minHeight: 380}}>
                    {props.children}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>

    );

};


export default CustomLayout;