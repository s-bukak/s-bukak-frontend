import React from 'react';
import formationSC from '../../assets/images/formationSC.png';

const Formation = () => {
    return (
        <div className="w-56 mb-6">
            <h2 className="text-xl font-bold">포메이션</h2>
            <div className="mt-2">
                <img src={formationSC} alt="Formation" className="h-auto  rounded-md" />
            </div>
        </div>
    );
};

export default Formation;
