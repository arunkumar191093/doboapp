import { createStackNavigator } from "react-navigation-stack";
import MyList from "../components/tabs/MyList";
import StoreByCampaign from "../components/StoreByCampaign";
import StorePage from "../components/StorePage/StorePage";
import { GiftVoucher } from "../components/GiftVoucher";
import RetailerVouchers from "../components/GiftVoucher/BuyVouchers/RetailerVouchers";
import Voucherdetails from "../components/GiftVoucher/MyVouchers/Voucherdetails";
import BuyVoucher from "../components/GiftVoucher/BuyVouchers/BuyVoucher";
import VoucherDetails from "../components/GiftVoucher/BuyVouchers/VoucherDetails";
import RedeemVoucher from "../components/GiftVoucher/MyVouchers/RedeemVoucher";
import ViewCoupons from "../components/GiftVoucher/BuyVouchers/ViewCoupons";
import StorePageDetails from "../components/StorePage/StorePageDetails";

export const MyListStack = createStackNavigator(
    {
        MyList: {
            screen: MyList,
            navigationOptions: {
                header: null,
            }
        },
        StoreByCampaign: StoreByCampaign,
        StorePage: {
            screen: StorePage,
            navigationOptions: {
                header: null,
            }
        },
        StorePageDetails: {
            screen: StorePageDetails,
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
        ViewCoupons: ViewCoupons
    },
);