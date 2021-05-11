<template>
    <div id="container"></div>
</template>
<script>
import { TMap } from "@/utils/TMap";

export default {
    name: "mapChild",
    props: {
        latitude: {
            type: String,
            default: "39.90555555555556",
        },
        longitude: {
            type: String,
            default: "116.42472222222223",
        },
    },
    data() {
        return {};
    },
    mounted() {
        TMap().then((qq) => {
            // 初始化中心点，传入想要设置的值
            // (经度, 纬度, 缩放比例);
            this.mapInit(this.longitude, this.latitude, 16);
        });
    },
    methods: {
        //父组件调用该函数，设置地点
        setLoc(lng, lat) {
            console.log("map setLoc");
            this.mapInit(lng, lat, 16);
        },
        // 根据传入的值渲染地图及传出经纬度和地名
        mapInit(lng, lat, zoom) {
            var map = new qq.maps.Map(document.getElementById("container"), {
                // 地图的中心地理坐标。
                center: new qq.maps.LatLng(lat, lng),
                zoom: zoom,
            });
            var marker = new qq.maps.Marker({
                position: new qq.maps.LatLng(lat, lng),
                map: map,
            });
        },
    },
};
</script>
<style>
#container {
    min-height: 250px;
}
</style>