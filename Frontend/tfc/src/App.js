import React, {Component} from "react";
import './App.css';
import 'antd/dist/reset.css';

import {BrowserRouter, Link, Route, Routes, Router} from "react-router-dom";

import CustomLayout from "./containers/Layout";
import UserLayout from "./containers/LayoutUser";
import StudioList from "./containers/StudioListView";
import DetailView from "./containers/DetailView";
import Register from "./components/User/register";
import Login from "./components/User/login";
import Logout from "./components/User/logout";
import DetailUserView from "./containers/DetailUser";
import UpdateUser from "./components/User/updateUser";
import CreateCard from "./components/Subscription/card"
import UpdateCard from "./components/Subscription/update"
import PayForm from "./components/Subscription/pay";
import CreateInvoice from "./components/Subscription/createinvoice"
import CancelPlan from "./components/Subscription/cancel"
import UpdatePlanForm from "./components/Subscription/updateplan"
import ChooseStudio from "./components/Classes/chooseStudioForm";
import MyCourse from "./components/Classes/seeMyCourse";
import Search from "./components/Studios/search"
import ClassSearch from "./components/Class/search_class";
import Filter from "./components/Studios/filter"
import ListStudio from "./components/Studios/list";

function App() {
    const userID = localStorage.getItem('userid');

    // render() {
    // GotoHome();
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<StudioList />} exact >
                    </Route>
                    <Route path="/:studioID" element={<DetailView />}>
                    </Route>
                    <Route path="/register" element={<Register />}>
                    </Route>
                    <Route path="/login" element={<Login />}>
                    </Route>
                    <Route path="/logout" element={<Logout />}>
                    </Route>
                    <Route path={`user/${userID}`} element={<DetailUserView />}>
                    </Route>
                    <Route path="/updateUser" element={<UpdateUser />}>
                    </Route>
                    <Route path="/createcard" element={<CreateCard />}>
                    </Route>
                    <Route path="/updatecard" element={<UpdateCard />}>
                    </Route>
                    <Route path="/payment" element={<PayForm />}>
                    </Route>
                    <Route path="/history" element={<CreateInvoice />}>
                    </Route>
                    <Route path="/cancelplan" element={<CancelPlan />}>
                    </Route>
                    <Route path="/updateplan" element={<UpdatePlanForm />}>
                    </Route>
                    <Route path="/viewcourses" element={<ChooseStudio />}>
                    </Route>
                    <Route path="/user/myclasses" element={<MyCourse />}>
                    </Route>
                    <Route path="/search" element={<Search />}>
                    </Route>
                    <Route path="/classes/search" element={<ClassSearch />}>
                    </Route>
                    <Route path="/filter" element={<Filter />}>
                    </Route>
                    <Route path="/shownearest" element={<ListStudio />}>
                    </Route>
                </Routes>

            </BrowserRouter>
        </div>
    );
}

export default App;
