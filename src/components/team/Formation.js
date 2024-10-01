import React from 'react';
import formationSC from '../../assets/images/formationSC.png';

const Formation = () => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold">포메이션</h2>
            <div className="mt-2">
                <img src={formationSC} alt="Formation" className="w-full h-auto" />
            </div>
        </div>
    );
};

export default Formation;
