import { IS_LOADING } from '../constants';
 const initialState ={
    isLoadingState: false
 };
 const loadingReducer = (state = initialState, action) => {
   console.log('Is Loading>>', action.type)
   switch (action.type) {
       case IS_LOADING:
           console.log('IsLoading Payload>>>', action.payload)
           return {
               ...state,
               isLoadingState: action.payload
           };
       default:
           return state;
   }
}
export default loadingReducer;