import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Home } from "./Home";
import { Info } from "./Info";
import { MagicLogin } from "./MagicLogin";
import { PushToken } from "./PushToken";
import { DebugScreens } from "./screens";
import { DebugNavigatorParamList } from "./types";

export const DebugStackNavigator = createStackNavigator<DebugNavigatorParamList>();

export type DebugNavigatorProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG>;

export function DebugNavigator({ route }: DebugNavigatorProps) {
  return (
    <DebugStackNavigator.Navigator screenOptions={{ headerShown: route.params.headerShown }}>
      <DebugStackNavigator.Screen
        name={DebugScreens.DEBUG_HOME}
        component={Home}
        options={{ title: "Debug" }}
      />
      <DebugStackNavigator.Screen
        name={DebugScreens.DEBUG_INFO}
        component={Info}
        options={{ title: "Info" }}
      />
      <DebugStackNavigator.Screen
        name={DebugScreens.DEBUG_MAGIC_LOGIN}
        component={MagicLogin}
        options={{ title: "Magic Login" }}
        initialParams={{ verifyScreen: route.params.verifyScreen }}
      />
      <DebugStackNavigator.Screen
        name={DebugScreens.DEBUG_PUSH_TOKEN}
        component={PushToken}
        options={{ title: "Push Token" }}
      />
    </DebugStackNavigator.Navigator>
  );
}
