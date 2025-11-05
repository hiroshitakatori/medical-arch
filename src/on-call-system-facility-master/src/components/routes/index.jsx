import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthMaster from '../layout/authLayout/AuthMaster';
import ErrorMaster from '../layout/errorLayout/ErrorMaster';
import routes from './routes';
import Master from '../layout/masterLayout/Master';
import FacilityMaster from '../layout/facilityLayout/FacilityMaster';
import authStores from '../contexs/AuthProvider';


const RoutePage = (props) => {
    const isAuthenticated = authStores((state) => state.isAuthenticated)
    // console.log({isAuthenticated});
    return (
        <Router>
            <Routes>
                {routes.map(({ path, auth, MenuCollapsed, layout, ActiveMenuKey, component: Component }, key) => {
                    return (
                        layout === 'auth' ? auth ?
                            <Route path={path} element={<Navigate replace to="/login" />} key={key}
                            />
                            :
                            auth === false ?
                                <Route path="/" element={<AuthMaster ptitle={Component.props.title} />} key={key} >
                                    <Route exact path={path} element={Component} />
                                </Route>
                                :
                                <Route path={path} element={<Navigate replace to="/login" />} key={key}
                                />
                            : layout === 'master' 
                            ? auth === true && isAuthenticated ?
                                <Route path="/" element={<Master MenuCollapsed={MenuCollapsed} ptitle={Component.props.title} />} key={key}>
                                    <Route exact path={path} element={Component} />
                                </Route>
                                :
                                <Route path={path} element={<Navigate to="/login" />} key={key}
                                />
                                : layout === 'facility' 
                                ? auth === true && isAuthenticated ?
                                    <Route path="/" element={<FacilityMaster MenuCollapsed={MenuCollapsed} ptitle={Component.props.title} />} key={key}>
                                        <Route exact path={path} element={Component} />
                                    </Route>
                                    :
                                    <Route path={path} element={<Navigate to="/login" />} key={key}
                                    />
                                    :
                                    <Route path="/" element={<ErrorMaster ptitle={Component.props.title} />} key={key} >
                                        <Route exact path={path} element={Component} />
                                    </Route>
                    )
                })
                }
            </Routes>
        </Router>
    )
}
export default RoutePage;