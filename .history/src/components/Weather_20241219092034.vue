<template>
  <div class="weather">
    <span>&nbsp;{{ weatherData.adCode.city }}&nbsp;</span>
    <span>&nbsp;{{ weatherData.weather.weather }}&nbsp;</span>
    <span>&nbsp;{{ weatherData.weather.temperature }}℃&nbsp;</span>
    <span>&nbsp;{{ weatherData.weather.windDirection }}&nbsp;</span>
    <span>&nbsp;{{ weatherData.weather.windSpeed }}级&nbsp;</span>
    <!-- <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection
      }}&nbsp;
    </span> -->
  </div>
</template>

<script setup>
import { getAdcode, getWeather, getOtherWeather, getCity } from "@/api";
import { Error } from "@icon-park/vue-next";

// 高德开发者 Key
const mainKey = import.meta.env.VITE_WEATHER_KEY;

const cityid = "";
// 天气数据
const weatherData = reactive({
  adCode: {
    city: "未知", // 城市
    adcode: "111", // 城市编码
  },
  weather: {
    weather: "加载天气", // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 获取天气数据
const getWeatherData = async () => {
  // 获取城市信息
  try {
    const city = await getCity();
    // console.log(city);

    weatherData.adCode = {
      city: city.info.city,
      adcode: weatherData.adCode.adcode,
    };
    // 获取城市代码
    try {
      const cid = await getAdcode(city.info.city);
      // console.log(city);

      weatherData.adCode = {
        city: weatherData.adCode.city,
        adcode: cid.data.list[0].id,
      };
      try {
        // if (!mainKey) {
        //   console.log("未配置，使用备用天气接口");
        //   const result = await getOtherWeather();
        //   console.log(result);
        //   const data = result.result;
        //   weatherData.weather = {
        //     weather: data.condition.condition,
        //     temperature: data.condition.temp,
        //     winddirection: data.condition.windDir,
        //     windpower: data.condition.windLevel,
        //   };
        // } 
        // else {}

        // 获取天气信息
        // const result = await getWeather(weatherData.adCode.adcode);
        const result = await getWeather(cid.data.list[0].id);
        console.log(result);
        console.log("@@@@@@");
        weatherData.weather = {
          weather: result.data.hourly[0].text || "加载异常",
          // description: result.weather[0].description,
          temperature: result.data.hourly[0].temp,
          windDirection: result.data.hourly[0].windDir,
          windSpeed: result.data.hourly[0].windScale,
        };

      } catch (error) {
        console.error("天气信息获取失败:" + error);
        onError("天气信息获取失败");
      }


      // console.log(weatherData);
      // console.log("weatherData");
    } catch (error) {
      console.error("获取城市代码失败:" + error);
    }

  } catch (error) {
    console.error("获取城市名失败:" + error);
  }



  // try {
  //   // if (!mainKey) {
  //   //   console.log("未配置，使用备用天气接口");
  //   //   const result = await getOtherWeather();
  //   //   console.log(result);
  //   //   const data = result.result;
  //   //   weatherData.weather = {
  //   //     weather: data.condition.condition,
  //   //     temperature: data.condition.temp,
  //   //     winddirection: data.condition.windDir,
  //   //     windpower: data.condition.windLevel,
  //   //   };
  //   // } 
  //   // else {}

  //   // 获取天气信息
  //   // const result = await getWeather(weatherData.adCode.adcode);
  //   const result = await getWeather(cityid);
  //   console.log(result);
  //   console.log("@@@@@@");
  //   weatherData.weather = {
  //     weather: result.data.hourly[0].text || "加载异常",
  //     // description: result.weather[0].description,
  //     temperature: result.data.hourly[0].temp,
  //     windDirection: result.data.hourly[0].windDir,
  //     windSpeed: result.data.hourly[0].windScale,
  //   };

  // } catch (error) {
  //   console.error("天气信息获取失败:" + error);
  //   onError("天气信息获取失败");
  // }
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
