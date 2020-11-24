import { GIFT_VOUCHER_BADGE} from '../constants';
 const initialState ={
    giftCount:0
 };
 const giftVoucherReducer = (state = initialState, action) => {
   console.log('GiftVoucher Count', action.type)
   switch (action.type) {
       case GIFT_VOUCHER_BADGE:
           console.log('GiftVoucher Payload>>>', action.payload)
           return {
               ...state,
               giftCount: action.payload
           };
       default:
           return state;
   }
}
export default giftVoucherReducer;