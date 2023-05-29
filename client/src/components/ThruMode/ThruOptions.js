const THRU_OFF = 0;
const THRU_TRS_TRS = 1;
const THRU_TRS_USB = 2;
const THRU_USB_USB = 3;
const THRU_USB_TRS = 4;
const THRU_BOTH_DIRECTIONS = 5;


const ThruOptions = [
    { name: "Thru Off", value: THRU_OFF },
    { name: "Thru TRS to TRS", value: THRU_TRS_TRS },
    { name: "Thru TRS to USB", value: THRU_TRS_USB },
    { name: "Thru USB to USB", value: THRU_USB_USB },
    { name: "Thru USB to TRS", value: THRU_USB_TRS },
    { name: "Thru Both USB & TRS", value: THRU_BOTH_DIRECTIONS },
];

export default ThruOptions;