import React from 'react';
import Version3Form from './Version3Form';
import Version4Form from './Version4Form';

function ControlChangeMacroForm(props) {
    return (
        <>
            {props.firmwareVersion[0] < 4 &&
                <Version3Form {...props} />
            }

            {props.firmwareVersion[0] > 3 &&
                <Version4Form {...props} />
            }
        </>
    )
}

export default ControlChangeMacroForm;