import { createStackNavigator } from "react-navigation-stack";
import NearMe from "../components/tabs/NearMe";
import LocationEditView from "../components/LocationEditView";
import LocationSearchPage from "../components/LocationEditView/LocationSearchPage";
import StorePage from "../components/StorePage/StorePage";
import StorePageDetails from "../components/StorePage/StorePageDetails";

export const NearMeStack = createStackNavigator({
    NearMe: {
        screen: NearMe
    },
    LocationEditView: {
        screen: LocationEditView,
    },
    LocationSearchPage: {
        screen: LocationSearchPage,
    },
    StorePage: {
        screen: StorePage,
        navigationOptions: {
            header: null
        },
    },
    StorePageDetails: {
        screen: StorePageDetails,
    }
},
);