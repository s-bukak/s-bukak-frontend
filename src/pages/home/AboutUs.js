import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../../styles/MarkdownStyles.css';

const AboutUs = () => {
    const [aboutUsContent, setAboutUsContent] = useState('');

    useEffect(() => {
        fetch('/docs/about-us.md')
            .then((response) => response.text())
            .then((text) => setAboutUsContent(text));
    }, []);

    return (
        <div className="my-20 mx-48">
            <div className="markdown-body">
                <ReactMarkdown>{aboutUsContent}</ReactMarkdown>
            </div>
        </div>
    );
};

export default AboutUs;
