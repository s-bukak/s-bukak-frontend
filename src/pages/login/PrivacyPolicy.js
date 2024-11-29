import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../../styles/MarkdownStyles.css';
import CommonHeader from "../../components/CommonHeader";

const PrivacyPolicy = () => {
    const [privacyPolicyContent, setPrivacyPolicyContent] = useState('');

    useEffect(() => {
        fetch('/docs/privacy-policy.md')
            .then((response) => response.text())
            .then((text) => setPrivacyPolicyContent(text));
    }, []);

    return (
        <>
            <CommonHeader/>
            <div className="my-40 mx-48">
                <div className="markdown-body">
                    <ReactMarkdown>{privacyPolicyContent}</ReactMarkdown>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
