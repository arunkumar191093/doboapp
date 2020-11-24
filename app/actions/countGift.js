import { GIFT_VOUCHER_BADGE } from '../constants';
export function changeVoucherCountState(voucherCountState) {
    return {
        type: GIFT_VOUCHER_BADGE,
        payload: voucherCountState
    }
}