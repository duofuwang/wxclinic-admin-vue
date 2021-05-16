<template>
    <div class="margin">
        <config-item :config="config" @reset="getConfig"></config-item>
    </div>
</template>

<script>
import { getConfig } from "@/api/config";
import ConfigItem from "./components/ConfigItem.vue";
export default {
    components: { ConfigItem },
    data() {
        return {
            config: {},
        };
    },
    mounted() {
        this.getConfig();
    },
    methods: {
        getConfig() {
            getConfig().then((res) => {
                this.config = res.data;
            });
        },
    },
};
</script>

<style>
</style>