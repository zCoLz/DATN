import React from 'react';
import Content from './page/Main/HomeScreen';
import JoinClassedStudent from './page/JoinClassed/JoinClassedStudent';
import JoinClassedTeacher from './page/JoinClassed/JoinClassedTeacher';

import Login from './page/Login/Login';
import HomeScreen from './page/Main/HomeScreen';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Dashboard from './page/Dashboard/Dashboard';
import AppClass from './page/Dashboard/AppClass';
import AppClassSection from './page/Dashboard/AppClassSection';
import AppFaculty from './page/Dashboard/AppFaculty';
import AppGenre from './page/Dashboard/AppGenre';
import AppStudent from './page/Dashboard/AppStudent';
import AppSubject from './page/Dashboard/AppSubject';
import AppTeacher from './page/Dashboard/AppTeacher';

import HomeScreenStudent from './page/Main/HomeScreenStudent';
import Detail from './page/Dashboard/Screen/Detail/Detail';
import { MdArrowBack } from 'react-icons/md';
import AppStorge from './page/Dashboard/AppStorage';
import JoinTest from './screens/TestStudent/JoinTest';
import JoinMark from './screens/TestStudent/JoinMark';
import DetailTest from './screens/Detail/DetailTest';
import DetailTestStudent from './screens/Detail/DetailTestStudent';
import DetailExcercise from './screens/Detail/DetailExercise/DetailExcercise';
import DetailAll from './screens/Detail/DetailAll';
import DetailDocument from './screens/Detail/DetailDocument';

function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/admin"
                    element={
                        <div>
                            <Dashboard />
                        </div>
                    }
                >
                    <Route
                        path="/admin/app-class"
                        element={
                            <div>
                                <AppClass />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-class-section"
                        element={
                            <div>
                                <AppClassSection />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-class-section/detail/:id"
                        element={
                            <div className="">
                                <Detail />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-storage"
                        element={
                            <div className="">
                                <AppStorge />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-faculty"
                        element={
                            <div>
                                <AppFaculty />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-genre"
                        element={
                            <div>
                                <AppGenre />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-student"
                        element={
                            <div>
                                <AppStudent />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-subject"
                        element={
                            <div>
                                <AppSubject />
                            </div>
                        }
                    ></Route>
                    <Route
                        path="/admin/app-teacher"
                        element={
                            <div>
                                <AppTeacher />
                            </div>
                        }
                    ></Route>
                </Route>
                <Route
                    path="/"
                    element={
                        <div>
                            <Login />
                        </div>
                    }
                />
                <Route
                    path="/giang-vien"
                    element={
                        <div>
                            <HomeScreen />
                        </div>
                    }
                />
                <Route
                    path="/giang-vien/class/:classroom_id"
                    element={
                        <div>
                            <JoinClassedTeacher />
                        </div>
                    }
                />
                <Route
                    path="/sinh-vien"
                    element={
                        <div>
                            <HomeScreenStudent />
                        </div>
                    }
                />
                <Route
                    path="/sinh-vien/class/:classroom_id"
                    element={
                        <div>
                            <JoinClassedStudent />
                        </div>
                    }
                />
                <Route path="/giang-vien/class/:classroom_id/:post_id/detail-test" element={<DetailAll />}></Route>
                <Route path="/giang-vien/class/:classroom_id/:post_id/document" element={<DetailDocument />}></Route>
                <Route path="/giang-vien/class/:classroom_id/:post_id/detail-test/test" element={<JoinMark />}></Route>
                <Route
                    path="/sinh-vien/class/:classroom_id/:post_id/detail-student"
                    element={<DetailExcercise />}
                ></Route>
                <Route
                    path="/sinh-vien/class/:classroom_id/:post_id/detail-student/test"
                    element={<JoinMark />}
                ></Route>
            </Routes>
        </>
    );
}

export default App;
