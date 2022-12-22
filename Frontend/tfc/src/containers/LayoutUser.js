import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const UserLayout = (props) => (
  <Layout>
    <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
      <div className="logo" />
      <Menu
            theme="dark"
            mode="horizontal"
            style={{lineHeight: '64px'}}
        >
            <Menu.Item key="1">
                <Link to="/">HomePage</Link>
            </Menu.Item>

            <Menu.Item key="2">
                <Link to="/login">Login</Link>
            </Menu.Item>

            <Menu.Item key="3">
                <Link to="/register">Register</Link>
            </Menu.Item>

            <Menu.Item key="4">
                <Link to="/logout">Logout</Link>
            </Menu.Item>

        </Menu>
    </Header>
    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          {props.children}
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
);


export default UserLayout;