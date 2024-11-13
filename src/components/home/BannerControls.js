import React from 'react';

const BannerControls = ({ onPrev, onNext }) => {
    return (
        <div className="banner-controls">
            <button onClick={onPrev}>◀</button>
            <button onClick={onNext}>▶</button>
        </div>
    );
};

export default BannerControls;
