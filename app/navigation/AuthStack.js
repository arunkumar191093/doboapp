import { createStackNavigator } from "react-navigation-stack";
import EnterMobileNumber from "../components/EnterMobileNumber";
import EnterOTP from "../components/EnterOTP";
import RegisterOptions from "../components/RegisterOptions";
import FaceBookConfirmation from "../components/RegisterOptions/FaceBookConfirmation";
import SignUp from '../components/SignUp/';
import LoginMainView from '../components/Login/LoginMainView'
import FaceBookSignUp from "../components/SignUp/FaceBookSignUp";

export const AuthStack = createStackNavigator({
    LoginMainView: { screen: LoginMainView },
    EnterMobileNumber: { screen: EnterMobileNumber },
    EnterOTP: { screen: EnterOTP },
    RegisterOptions: { screen: RegisterOptions },
    FaceBookConfirmation: { screen: FaceBookConfirmation },
    SignUp: { screen: SignUp },
    FaceBookSignUp: { screen: FaceBookSignUp },
});