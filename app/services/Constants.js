import {
    Dimensions, Platform,
} from 'react-native'
const { width, height } = Dimensions.get('window')

//export const baseURL = "https://retailer-dobo.app"
export const baseURL = "http://do-bo.in"
export const imageResBaseUrl = baseURL + "/"
export const BOTTOM_TAB_HEIGHT = 54/*(height / 12)*/
export const TOP_HEADER_HEIGHT = 54/*(height / 10)*/
export const STORE_DETAILS_HEIGHT = (height / 3)
export const NEAR_ME_BUTTON_POSITION = (height / 6)
export const STORE_CHECKIN_BUTTON_POSITION = (height / 1.5)
export const SCREEN_HEIGHT = height
export const EXPAND_IMAGE_WIDTH = (width)
export const EXPAND_IMAGE_HEIGHT = (height / 2)
export const BANNER_ASPECT_RATIO = 0.6


export const SCREEN_WIDTH = width
export const BANNER_HEIGHT = BANNER_ASPECT_RATIO * SCREEN_WIDTH
export const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = (Platform.OS === 'ios' ? 0.3 : 0.5)
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
export const MAP_LOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000 };

//Color Constants
export const DOBO_RED_COLOR = '#F64658'
export const DOBO_RED_DISABLED_COLOR = '#FBA3AC'
export const DOBO_GREY_COLOR = '#31546E'
export const BACKGROUND_COLOR = '#F7EEED'
export const LIGHT_GREY_COLOR = '#7FA7B9'
export const BODY_TEXT_COLOR = '#838383'
export const HIGHLIGHT_COLOR = '#FFFDDE'
export const LABEL_FONT_COLOR = '#31546E'
export const PLACEHOLDER_FONT_COLOR = '#A0A0A0'
export const LIGHT_BACKGROUND_GREY_COLR = '#E9E9E9'
export const SEMI_BOLD_FONT_COLOR = '#31546E'
export const LIGHT_GREY = '#81A8BA'


export const GRADIENT_COLOR = 'rgba(0, 0, 0, 0.8)'
export const LIGHT_GRADIENT_COLOR = 'rgba(0, 0, 0, 0.3)'
export const BORDER_WITHOUT_FOCUS = '#e6eef1';

// List text color and size
export const LIST_FONT_HEADER_SIZE = 14;
export const LIST_FONT_SIZE_ADDRESS = 12;
export const LIST_FONT_FAMILY = "Montserrat-Regular";
export const HEADING_FONT_FAMILY = "Montserrat Medium";
export const LIST_STAR_SIZE = 12;
export const RADIUS_DISTANCE = 20;
export const LOCATION_INTERVAL = 5 * 60 * 1000
export const DISTANCE_FILTER_MTR = 100



export const BOLD_FONT_FAMILY = 'Montserrat-Bold'
export const SEMI_BOLD_FONT_FAMILY = 'Montserrat SemiBold'
export const DEFAULT_PROFILE_IMAGE = 'https://www.searchpng.com/wp-content/uploads/2019/11/Profile-Icon-1.jpg'
export const VERIFICATION_CODE_TIMEOUT = 45000
export const APP_CONST_PASSWORD = 'Welcom0ef!'
export const DEFAULT_LOCATION_STRING = 'Locating...'
export const YOUTUBE_API_KEY = 'AIzaSyCT9mPli87T522J7x_xrBDO6wb51ZPz_Y0'
export const MAPS_API_CALL_KEY = 'AIzaSyBu4y9cmY9yqrwcnAbV0o8ofRl__YjJuQk'
export const DEFAULT_STORE_IMAGE = baseURL + '/Upload/2/ss1.png'
export const DEFAULT_STORE_ICON = baseURL + '/Upload/2/ss.jpg'
export const DEFAULT_DOBO_ICON = baseURL + '/assets/images/dobologo.png'

export const FIREBASE_SENDER_ID = '1044454681235'

export const STATUS_ENUM = {
    Submitted: 'Pending Confirmation',
    Confirmed: 'Confirmed',
    PartiallyConfirmed: 'Partially Confirmed',
    NotAvailable: 'Not Available',
    Open: ''
}

export const HELPLINE_NUMBER = 1234567890

export const SHOW_FEATURE = false;