import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { windowHeight, windowWidth } from "../themes/app.constant";
import { useTheme } from "@/context/theme-context";

export default function SkeletonLoader() {
  const { theme } = useTheme();

  return (
    <MotiView
      transition={{
        type: "timing",
      }}
      className={`flex-1 justify-center ${theme.dark ? "bg-transparent" : "bg-white"}`}
    >
      <Skeleton
        width={windowWidth(440)}
        height={windowHeight(160)}
        colorMode={theme.dark ? "dark" : "light"}
      />
      <Spacer />
      <View className="flex-row gap-4">
        <Skeleton
          colorMode={theme.dark ? "dark" : "light"}
          radius="round"
          height={windowWidth(80)}
          width={windowWidth(80)}
        />
        <View>
          <Skeleton
            width={windowWidth(338)}
            height={windowHeight(20)}
            colorMode={theme.dark ? "dark" : "light"}
          />
          <Spacer />
          <Skeleton
            width={windowWidth(338)}
            height={windowHeight(20)}
            colorMode={theme.dark ? "dark" : "light"}
          />
          <Spacer />
        </View>
      </View>
    </MotiView>
  );
}

export const Spacer = ({ height = 16 }) => <View style={{ height }} />;
