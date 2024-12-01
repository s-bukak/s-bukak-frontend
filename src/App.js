import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Footer from './components/Footer';

// 페이지 컴포넌트 동적 임포트
const SignIn = React.lazy(() => import('./pages/login/SignIn'));
const SignUp = React.lazy(() => import('./pages/login/SignUp'));
const Terms = React.lazy(() => import('./pages/login/Terms'));
const PrivacyPolicy = React.lazy(() => import('./pages/login/PrivacyPolicy'));
const Faq = React.lazy(() => import('./pages/login/Faq'));


const Home = React.lazy(() => import('./pages/home/Home'));

const FreeCommunity = React.lazy(() => import('./pages/community/FreeCommunity'));
const PracticeCommunity = React.lazy(() => import('./pages/community/PracticeCommunity'));
const WriteCommunity = React.lazy(() => import('./pages/community/writeCommunity/WriteCommunity'));
const CommunityDetail = React.lazy(() => import('./pages/community/communityDetail/CommunityDetail'));

const MyWrote = React.lazy(() => import('./pages/activity/MyWrote'));
const MyComment = React.lazy(() => import('./pages/activity/MyComment'));


const AboutUs = React.lazy(() => import('./pages/home/AboutUs'));
const ContactUs = React.lazy(() => import('./pages/home/ContactUs'));
const Notice = React.lazy(() => import('./pages/home/Notice'));

const Schedule = React.lazy(() => import('./pages/schedule/Schedule'));
const Ranking = React.lazy(() => import('./pages/ranking/Ranking'));
const Team = React.lazy(() => import('./pages/team/Team'));

export const DOMAIN_NAME = process.env["REACT_APP_BASE_URL"];

// Layout 컴포넌트: Header와 Footer를 조건부로 렌더링
const Layout = ({ children }) => {
    const location = useLocation(); // React Router의 현재 경로 가져오기
    const hideHeaderFooter = ['/signin', '/signup', '/terms', '/privacy-policy', '/faq'].some(path =>
        location.pathname.startsWith(path)
    );

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeaderFooter && <Header />}
            <main className="flex-grow">{children}</main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

const ClientID = '876612813769-4lfsesru9gnomuu6am1udlnb1d47hjtq.apps.googleusercontent.com';
// Router 내부에서 동작하도록 별도 컴포넌트 작성
function AppRoutes() {
    useEffect(() => {
        // URL에서 JWT 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            try {
                // JWT를 로컬 스토리지에 저장
                localStorage.setItem('access_token', token);

                // URL 정리
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('JWT 디코딩 오류:', error);
                localStorage.removeItem('access_token');
            }
        }
    }, []);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/free-community" element={<FreeCommunity />} />
                <Route path="/practice-community" element={<PracticeCommunity />} />
                <Route path="/write-community" element={<WriteCommunity />} />
                <Route path="/community-detail/:boardId" element={<CommunityDetail />} />
                <Route path="/my-wrote" element={<MyWrote />} />
                <Route path="/my-comment" element={<MyComment />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/team" element={<Team />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/faq" element={<Faq />} />
            </Routes>
        </Layout>
    );
}

function App() {
    return (
        <RecoilRoot>
            <GoogleOAuthProvider clientId={ClientID}>
                <Router>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AppRoutes />
                    </Suspense>
                </Router>
            </GoogleOAuthProvider>
        </RecoilRoot>
    );
}

export default App;
