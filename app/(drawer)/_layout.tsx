import { Drawer } from 'expo-router/drawer'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

export default function RootLayout() {
    return (
        <GestureHandlerRootView style ={{flex: 1}}>
            <Drawer>
                <Drawer.Screen 
                name ="home"
                options={{
                    drawerLabel: 'Home',
                    title: 'Newsfeed'
                }}
            />

            <Drawer.Screen 
            name ="profile"
            options={{
                drawerLabel: 'Profile',
                title: 'User Profile'
            }}
            />
            <Drawer.Screen 
            name='setting'
            options={{
                drawerLabel: 'Setting',
                title: 'Setting'
            }}
            />
            </Drawer>
            
        </GestureHandlerRootView>
    )
}