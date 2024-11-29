import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../../styles/MarkdownStyles.css';
import CommonHeader from "../../components/CommonHeader";

const Terms = () => {
    const [termsContent, setTermsContent] = useState('');

    useEffect(() => {
        fetch('/docs/terms.md')
            .then((response) => response.text())
            .then((text) => setTermsContent(text));
    }, []);

    return (
        <>
            <CommonHeader/>
            <div className="my-40 mx-48">
                <div className="markdown-body">
                    <ReactMarkdown>{termsContent}</ReactMarkdown>
                </div>
            </div>
        </>
    );
};

export default Terms;
