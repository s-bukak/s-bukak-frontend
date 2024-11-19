import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { GoogleOAuthProvider } from '@react-oauth/google'; // GoogleOAuthProvider 추가
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지 컴포넌트 동적 임포트
const SignIn = React.lazy(() => import('./pages/login/SignIn'));
const SignUp = React.lazy(() => import('./pages/login/SignUp'));
const Home = React.lazy(() => import('./pages/home/Home'));
const Community = React.lazy(() => import('./pages/community/Community'));
const Schedule = React.lazy(() => import('./pages/schedule/Schedule'));
const Ranking = React.lazy(() => import('./pages/ranking/Ranking'));
const Team = React.lazy(() => import('./pages/team/Team'));
const Terms = React.lazy(() => import('./pages/login/Terms')); // Terms 페이지 추가
const PrivacyPolicy = React.lazy(() => import('./pages/login/PrivacyPolicy')); // PrivacyPolicy 페이지 추가

// Layout 컴포넌트: Header와 Footer를 조건부로 렌더링
const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderFooter = ['/signin', '/signup', '/terms', '/privacy-policy'].includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeaderFooter && <Header />}
            <main className="flex-grow">{children}</main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

const ClientID = '876612813769-4lfsesru9gnomuu6am1udlnb1d47hjtq.apps.googleusercontent.com';

export const DOMAIN_NAME = process.env["REACT_APP_BASE_URL"];
export const TOKEN_NAME = process.env["REACT_APP_TOKEN_TEMP_URL"];

function App() {
    return (
        <RecoilRoot>
            <GoogleOAuthProvider clientId={ClientID}>
                <Router>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/schedule" element={<Schedule />} />
                                <Route path="/ranking" element={<Ranking />} />
                                <Route path="/team" element={<Team />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/terms" element={<Terms />} /> {/* Terms 라우트 추가 */}
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* Privacy Policy 라우트 추가 */}
                            </Routes>
                        </Layout>
                    </Suspense>
                </Router>
            </GoogleOAuthProvider>
        </RecoilRoot>
    );
}

export default App;
