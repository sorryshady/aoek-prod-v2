import { LinearGradient } from "expo-linear-gradient";
import {
  Platform,
  ImageBackground,
  ViewProps,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function GradientBackground({
  children,
  style,
  ...props
}: GradientBackgroundProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/black-bridge.webp")}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={["#5386A4E6", "#1F333EF2"]}
          style={[styles.gradient, style]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          {...props}
        />
      </ImageBackground>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: Platform.OS === "ios" ? SCREEN_HEIGHT : SCREEN_HEIGHT + 34,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    marginBottom: Platform.OS === "ios" ? -34 : 0,
  },
});
