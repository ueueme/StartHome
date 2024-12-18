<template>
  <div class="weather">
    <span>{{ &nbsp;weatherData.adCode.city }}&nbsp;</span>
    <span>{{ &nbsp;weatherData.weather.weather }}&nbsp;</span>
    <span>{{ &nbsp;weatherData.weather.temperature }}℃&nbsp;</span>
    <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection
      }}&nbsp;
    </span>
  </div>
</template>

<script setup>
import { getAdcode, getWeather, getOtherWeather } from "@/api";
import { Error } from "@icon-park/vue-next";

// 高德开发者 Key
const mainKey = import.meta.env.VITE_WEATHER_KEY;

// 天气数据
const weatherData = reactive({
  adCode: {
    city: "NY", // 城市
    adcode: "00000", // 城市编码
  },
  weather: {
    weather: "Sunny", // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 获取天气数据
const getWeatherData = async () => {
  try {
    // 获取地理位置信息
    if (!mainKey) {
      console.log("未配置，使用备用天气接口");
      const result = await getOtherWeather();
      console.log(result);
      const data = result.result;
      weatherData.adCode = {
        city: data.city.city_name || "未知地区",
        // adcode: data.city.cityId,
      };
      weatherData.weather = {
        weather: data.condition.condition,
        temperature: data.condition.temp,
        winddirection: data.condition.windDir,
        windpower: data.condition.windLevel,
      };
    } else {
      // 获取天气信息
      const result = await getWeather(40.730610, -74.006, mainKey);
      weatherData.adCode = {
        city: "New York",
        adcode: "10000",
      };
      weatherData.weather = {
        weather: result.weather[0].main || "UnknownW",
        description: result.weather[0].description || "Unknown WD",
        temperature: result.main.temp || "Unknown Temp",
        windSpeed: result.wind.speed || "fast Af",
        windDirection: result.wind.deg || "Unknwn WD",
      };
    }
  } catch (error) {
   console.error("天气信息获取失败:" + error);
   onError("天气信息获取失败");
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  // 调用获取天气
  getWeatherData();
});
</script>
