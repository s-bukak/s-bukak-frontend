import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../../styles/MarkdownStyles.css';

const ContactUs = () => {
    const [contactUsContent, setContactUsContent] = useState('');

    useEffect(() => {
        fetch('/docs/contact-us.md')
            .then((response) => response.text())
            .then((text) => setContactUsContent(text));
    }, []);

    return (
        <div className="my-20 mx-48">
            <div className="markdown-body">
                <ReactMarkdown>{contactUsContent}</ReactMarkdown>
            </div>
        </div>
    );
};

export default ContactUs;
