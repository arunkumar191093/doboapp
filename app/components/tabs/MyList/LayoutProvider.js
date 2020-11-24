import { GridLayoutProvider } from 'recyclerlistview-gridlayoutprovider';
import * as Constants from '../../../services/Constants'
const MAX_SPAN = 2;

export default class LayoutProvider extends GridLayoutProvider {
    constructor(props) {
        super(MAX_SPAN,
            (index) => {
                return props.getDataForIndex(index).type;
            },
            (index) => {
                let type = props.getDataForIndex(index).type;
                switch (type) {
                    case "STORE_ITEM":
                        return 1;
                    case "CN_ITEM":
                        return 2;
                    case "PRODUCT_ITEM":
                        return 1;
                    default:
                        return 2;
                }
            },
            (index) => {
                let type = props.getDataForIndex(index).type;
                switch (type) {
                    case "STORE_ITEM":
                        return Constants.SCREEN_WIDTH / 2
                    case "PRODUCT_ITEM":
                        return Constants.SCREEN_WIDTH / 2
                    case "CN_ITEM":
                        return Constants.SCREEN_WIDTH * 0.6;
                    default:
                        return 0;
                }
            },

        );
    }
}