import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import AppStack from './AppStack';
import { colors } from '../theme/theme';

const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { width: 280 },
        overlayColor: 'rgba(0,0,0,0.4)',
        swipeEdgeWidth: 30,
      }}
    >
      <Drawer.Screen
        name="Main"
        component={AppStack}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}

export default AppDrawer;
