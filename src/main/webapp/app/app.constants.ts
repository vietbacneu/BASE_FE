// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
export const SSO_LOGIN_URL = "http://192.168.100.121:8225/sso/login";
export const DOMAIN_CODE = "CTCT";

export const GLOBAL_TIMEZONE: Timezone[] = [
    {value: 0, label: '±0'},
    {value: 1, label: '+1'},
    {value: 2, label: '+2'},
    {value: 3, label: '+3'},
    {value: 4, label: '+4'},
    {value: 5, label: '+5'},
    {value: 6, label: '+6'},
    {value: 7, label: '+7'},
    {value: 8, label: '+8'},
    {value: 9, label: '+9'},
    {value: 10, label: '+10'},
    {value: 11, label: '+11'},
    {value: 12, label: '+12'},
    {value: -11, label: '-11'},
    {value: -10, label: '-10'},
    {value: -9, label: '-9'},
    {value: -8, label: '-8'},
    {value: -7, label: '-7'},
    {value: -6, label: '-6'},
    {value: -5, label: '-5'},
    {value: -4, label: '-4'},
    {value: -3, label: '-3'},
    {value: -2, label: '-4'},
    {value: -1, label: '-1'},
];

export class Timezone {
    value: any;
    label: any;

    constructor(value: any, label: any) {
        this.value = value;
        this.label = label;
    }
}

export enum HTTP_STATUS {
    OK = 200
}

export enum APP_PARAM_TYPE {
    QUYTAC_LAMTRON = 'QUYTAC_LAMTRON',
    TRUNK_TYPE = 'TRUNK_TYPE',
    PARTNER_TYPE = 'PARTNER_TYPE',
}

export enum CREATION_METHOD {
    AUTO = 3,
    MANUAL = 2,
    SINGLE = 1,
    ENTERED = 0,
}

export enum Constants {
    STATUS_WARNING = 2,
    STATUS_ACTIVE = 1,
    STATUS_INACTIVE = 0,
    SEARCH_METHOD_LIKE = 'LIKE',
    SEARCH_METHOD_EXACTLY = 'EXACTLY',
    PARTNER_TYPE_1 = '1',
    PARTNER_TYPE_2 = '2',
    PARTNER_TYPE_3 = '3',
    INCOMING = 'INCOMING',
    OUTGOING = 'OUTGOING',
    CONTRACT_TYPE_1 = '1',
    CONTRACT_TYPE_2 = '2',
    CONTRACT_TYPE_3 = '3',
    CONTRACT_TYPE_4 = '4',
}