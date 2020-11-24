import { createStackNavigator } from "react-navigation-stack";
import Profile from "../components/tabs/Profile/index";
import Coupons from "../components/Coupons";
import Referal from "../components/Referal";
import { GiftVoucher } from "../components/GiftVoucher";
import RetailerVouchers from "../components/GiftVoucher/BuyVouchers/RetailerVouchers";
import Voucherdetails from "../components/GiftVoucher/MyVouchers/Voucherdetails";
import BuyVoucher from "../components/GiftVoucher/BuyVouchers/BuyVoucher";
import VoucherDetails from "../components/GiftVoucher/BuyVouchers/VoucherDetails";
import RedeemVoucher from "../components/GiftVoucher/MyVouchers/RedeemVoucher";
import MyCheckins from "../components/StoreCheckin/MyCheckin";
import MyCheckinDetails from "../components/StoreCheckin/MyCheckinDetails";
import * as Constants from '../services/Constants'
import ViewCoupons from "../components/GiftVoucher/BuyVouchers/ViewCoupons";

const navigationOptions = {
    headerTitleStyle: {
        fontFamily: Constants.LIST_FONT_FAMILY
    }
}

export const ProfileStack = createStackNavigator(
    {
        Profile: {
            screen: Profile,
        },
        GiftVoucherTab: {
            screen: GiftVoucher,
            navigationOptions: {
                title: 'Gift Vouchers',
            }
        },
        RetailerVouchers: RetailerVouchers,
        VoucherDetails: VoucherDetails,
        BuyVoucher: BuyVoucher,
        Voucherdetails: Voucherdetails,
        RedeemVoucher: RedeemVoucher,
        ViewCoupons: ViewCoupons,
        Coupons: {
            screen: Coupons,
            navigationOptions: {
                ...navigationOptions,
                title: 'Coupons',
            }
        },
        Referal: {
            screen: Referal,
            navigationOptions: {
                ...navigationOptions,
                title: 'Refer & Earn',
            }
        },
        MyCheckins: {
            screen: MyCheckins,
            navigationOptions: {
                ...navigationOptions,
                title: 'My Check-ins',
            }
        },
        MyCheckinDetails: {
            screen: MyCheckinDetails,
            navigationOptions: {
                ...navigationOptions,
                title: 'My Check-ins',
            }
        }
    },
);