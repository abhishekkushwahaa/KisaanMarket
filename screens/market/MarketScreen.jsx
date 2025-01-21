import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PrivateVendorScreen from "@/screens/market/PrivateVendorScreen";
import PublicVendorScreen from "@/screens/market/PublicVendorScreen";

const Tab = createMaterialTopTabNavigator();

export default function MarketScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Private" component={PrivateVendorScreen} />
            <Tab.Screen name="Public" component={PublicVendorScreen} />
        </Tab.Navigator>
    );
}