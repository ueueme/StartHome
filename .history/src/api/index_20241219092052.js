// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  // const res = await fetch("https://v1.hitokoto.cn");
  const res = await fetch("https://v1.jinrishici.com/all.json");
  return await res.json();
};

/**
 * ip获取城市名
 */
export const getCity = async () => {
  const res = await fetch("https://api.vvhan.com/api/ipInfo");
  return await res.json();
};

/**
 * 天气代码
 */

export const getAdcode = async (city) => {
  // const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  const res = await fetch(`https://weatheroffer.com/api/weather/city?location=${city}&lang=zh`);
  // console.log(res);
  return await res.json();
};

// 获取天气信息
export const getWeather = async (cid) => {
  // const url = "https://api.codelife.cc/api/getLocation?lang=cn"; // 目标URL
  // const headers = new Headers({
  //   "Content-Type": "application/json",
  //   Authorization: "Bearer YOUR_TOKEN", // 替换为你的认证令牌
  // });
  // const sendheaders = new Headers({
  //   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
  //   "Connection": "keep-alive",
  //   "access-control-allow-origin": "*",
  //   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  //   "Accept-Language": "zh-CN,zh;q=0.8"
  // });

  // const options = {
  //   method: 'GET', // 请求方法
  //   headers: sendheaders, // 添加的请求头
  //   // body: JSON.stringify({ key: 'value' }) // 请求体
  // };

  const res = await fetch(
    // `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=imperial`
    // `https://api.codelife.cc/api/getWeather?lang=cn&location=${city}&type=city`
    // `https://api.52vmy.cn/api/query/tian`,
    // `https://api.wetab.link/api/weather/hourly?location=101190104&lang=zh`,
    `https://api.wetab.link/api/weather/hourly?location=${cid}&lang=zh`,
    // {
    //   mode: "no-cors",
    // },
    // url, options
  );
  // console.log("res");
  // console.log(res);
  // console.log(res.json());
  // console.log("res");
  return await res.json();
};

// export const testWeather =  function testWeather() {

// }

// 其他天气api
export const getOtherWeather = async () => {
  const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
  return await res.json();
};
