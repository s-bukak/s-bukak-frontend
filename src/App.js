import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지 컴포넌트 동적 임포트
const SignIn = React.lazy(() => import('./pages/login/SignIn'));
const SignUp = React.lazy(() => import('./pages/login/SignUp'));
const Home = React.lazy(() => import('./pages/home/Home'));

const FreeCommunity = React.lazy(() => import('./pages/community/FreeCommunity'));
const PracticeCommunity = React.lazy(() => import('./pages/community/PracticeCommunity'));
const WriteCommunity = React.lazy(() => import('./pages/community/writeCommunity/WriteCommunity'));
const CommunityDetail = React.lazy(() => import('./pages/community/communityDetail/CommunityDetail'));

const MyWrote = React.lazy(() => import('./pages/activity/MyWrote'));
const MyComment = React.lazy(() => import('./pages/activity/MyComment'));


const Schedule = React.lazy(() => import('./pages/schedule/Schedule'));
const Ranking = React.lazy(() => import('./pages/ranking/Ranking'));
const Team = React.lazy(() => import('./pages/team/Team'));

// Layout 컴포넌트: Header와 Footer를 조건부로 렌더링
const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/signin' || location.pathname === '/signup';

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeaderFooter && <Header />}
            <main className="flex-grow">{children}</main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

export const DOMAIN_NAME = process.env["REACT_APP_BASE_URL"];

function App() {
    return (
        <RecoilRoot>
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/free-community" element={<FreeCommunity />} />
                            <Route path="/practice-community" element={<PracticeCommunity />} />
                            <Route path="/write-community" element={<WriteCommunity />} />
                            <Route path="/community-detail" element={<CommunityDetail />} />

                            <Route path="/my-wrote" element={<MyWrote />} />
                            <Route path="/my-comment" element={<MyComment />} />

                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/ranking" element={<Ranking />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/signup" element={<SignUp />} />
                        </Routes>
                    </Layout>
                </Suspense>
            </Router>
        </RecoilRoot>
    );
}

export default App;
