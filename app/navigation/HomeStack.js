import { createStackNavigator } from "react-navigation-stack";
import Home from "../components/tabs/Home";
import LocationEditView from "../components/LocationEditView";
import LocationSearchPage from "../components/LocationEditView/LocationSearchPage";
import AddLocationView from "../components/LocationEditView/AddLocationView";
import StorePage from "../components/StorePage/StorePage";
import StoreCategory from "../components/StoreCategory/StoreCategory";
import StoreCheckin from "../components/StoreCheckin/StoreCheckin";
import StoreCheckinDetails from "../components/StoreCheckinDetails/StoreCheckinDetails";
import StoreCheckinQR from "../components/StoreCheckinQR/StoreCheckinQR";
import { GiftVoucher } from "../components/GiftVoucher";
import StoreByCampaign from "../components/StoreByCampaign";
import RetailerVouchers from "../components/GiftVoucher/BuyVouchers/RetailerVouchers";
import VoucherDetails from "../components/GiftVoucher/BuyVouchers/VoucherDetails";
import BuyVoucher from "../components/GiftVoucher/BuyVouchers/BuyVoucher";
import Voucherdetails from "../components/GiftVoucher/MyVouchers/Voucherdetails";
import RedeemVoucher from "../components/GiftVoucher/MyVouchers/RedeemVoucher";
import CheckinConfirmation from "../components/StoreCheckin/CheckinConfirmation";
import HomeCheckinQR from "../components/StoreCheckinQR/HomeCheckinQR";
import ViewCoupons from "../components/GiftVoucher/BuyVouchers/ViewCoupons";
import StorePageDetails from "../components/StorePage/StorePageDetails";
import StoreBag from "../components/StorePage/StoreBag";
import AllBags from "../components/StorePage/AllBags";
import PayNowSummary from "../components/StorePage/PayNowSummary";

const HomeStack = createStackNavigator({
    Home: {
        screen: Home,
    },
    LocationEditView: {
        screen: LocationEditView,
    },
    LocationSearchPage: {
        screen: LocationSearchPage,
    },
    AddLocationView: {
        screen: AddLocationView
    },
    StorePage: {
        screen: StorePage,
        navigationOptions: {
            header: null
        },
    },
    StorePageDetails: {
        screen: StorePageDetails,
        navigationOptions: {
            header: null
        },
    },
    // Category details
    StoreCategory: {
        screen: StoreCategory,
        navigationOptions: {
            header: null
        },
    },
    StoreCheckin: {
        screen: StoreCheckin,
        navigationOptions: {
            header: null
        },
    },
    StoreCheckinDetails: {
        screen: StoreCheckinDetails,
        navigationOptions: {
            header: null
        },
    },
    StoreCheckinQR: {
        screen: StoreCheckinQR,

    },
    HomeCheckinQR: {
        screen: HomeCheckinQR,

    },
    CheckinConfirmation: {
        screen: CheckinConfirmation,
        navigationOptions: {
            header: null
        },
    },
    GiftVoucherTab: {
        screen: GiftVoucher,
        navigationOptions: {
            title: 'Gift Vouchers',
        }
    },
    StoreByCampaign: {
        screen: StoreByCampaign,
        navigationOptions: {
            header: null,
        },
    },
    StoreBag: {
        screen: StoreBag,
        navigationOptions: {
            header: null,
        },
    },
    AllBags: {
        screen: AllBags,
        navigationOptions: {
            header: null,
        },
    },
    PayNowSummary: {
        screen: PayNowSummary,
        navigationOptions: {
            header: null,
        },
    },
    RetailerVouchers: RetailerVouchers,
    VoucherDetails: VoucherDetails,
    BuyVoucher: BuyVoucher,
    Voucherdetails: Voucherdetails,
    RedeemVoucher: RedeemVoucher,
    ViewCoupons: ViewCoupons

},
);

HomeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
            if (route.routeName === "StorePageDetails" || route.routeName === "StoreBag" ||
                route.routeName === "AllBags" || route.routeName === "PayNowSummary") {
                tabBarVisible = false;
            } else {
                tabBarVisible = true;
            }
        });
    }

    return {
        tabBarVisible
    };
};

export default HomeStack;