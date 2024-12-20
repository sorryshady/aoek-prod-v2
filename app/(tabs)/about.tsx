import { ScrollView, Text, View, Image, Platform } from "react-native";

import GradientBackground from "@/components/gradient-background";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  return (
    <SafeAreaView className="flex-1">
      <GradientBackground>
        <ScrollView
          className="flex-1 px-4 pt-6 pb-0"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View className="px-4 py-10">
            {/* Header Section */}
            <View className="mb-8">
              <Text className="text-3xl font-pbold text-white text-center">
                About Us
              </Text>
              <Text className="text-base text-gray-200 font-pregular text-center mt-2">
                Learn more about our organization
              </Text>
            </View>

            {/* Logo Section */}
            <View className="items-center justify-center">
              <Image
                source={images.logo}
                className="w-[200px] h-[200px]"
                resizeMode="contain"
              />
            </View>

            {/* Content Section */}
            <View className="px-2">
              <Text className="text-white text-base font-pregular leading-6 text-center">
                The Public Works, Irrigation & Local Self Government Departments
                of Government of Kerala have united over a common goal and
                formed a non-profit organization with over 3000 engineers. This
                organization provides free technical materials for the public
                and civil engineers in the private sector, technical papers from
                its members, and government circulars and orders related to
                construction and infrastructural development.
              </Text>

              <Text className="text-white font-pregular text-base leading-6 text-center mt-4">
                Formed in the <Text className="font-pbold">year 1963</Text> and
                united by a shared vision, this organization aims to work
                towards the welfare of engineers in these departments. The
                Association actively engages in contributing to the development
                and progress of the State of Kerala, as its members are working
                in departments which are the major execution agencies of public
                works of the State.
              </Text>

              <Text className="text-white font-pregular text-base leading-6 text-center mt-4">
                The retired Engineers will also continue to be the life members
                of the Association attached to a district centre where their
                residence is located or a district of their choice. However,
                they will not have voting rights unless elected as State
                Executive Committee members. A State Executive Committee with 46
                members having a term of one calendar year is the authority
                entrusted by the General body to take a final decision on all
                matters related to the Association. The Association has district
                centres in all the 14 districts of the State established as per
                the bye law. The State Executive Committee meetings are
                conducted every month in various districts as per a prefixed
                schedule.
              </Text>

              <Text className="text-white font-pregular text-base leading-6 text-center mt-4 mb-8">
                Three volumes of newsletters publishing every calendar year act
                as an effective mode of communication to its members about the
                activities of the Association.
              </Text>
            </View>
          </View>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}
