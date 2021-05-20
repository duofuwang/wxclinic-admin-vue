<template>
    <div class="dashboard-container">
        <div class="dashboard-text">欢迎您: {{ name }}</div>

        <panel-group
            :newVisits="newVisits"
            :messageNum="messageNum"
            :finance="finance"
            :emergencyNum="emergencyNum"
            @handleSetLineChartData="handleSetLineChartData"
        />
        <el-row
            style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px"
        >
            <line-chart :chart-data="lineChartData" :xData="xData" />
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getRecentMonthFinance } from "@/api/finance";

import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import { getNewVisitStatistics } from "@/api/user";
import { getMessageStatistics } from "@/api/message";
import { getEmergencyStatistics } from "@/api/emergency";

export default {
    name: "Dashboard",
    components: {
        PanelGroup,
        LineChart,
    },
    computed: {
        ...mapGetters(["name"]),
    },
    data() {
        return {
            lineChartData: {},
            xData: [],
            newVisits: 0,
            messageNum: 0,
            finance: 0,
            emergencyNum: 0,

            financeStatistics: {},
            messageStatistics: {},
            newVisitStatistics: {},
            emergencyStatistics: {},
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        handleSetLineChartData(type) {
            if (type == "messages") {
                this.lineChartData = this.messageStatistics;
                this.xData = [...this.messageStatistics.datetime];
            } else if (type == "finance") {
                this.lineChartData = this.financeStatistics;
                this.xData = [...this.financeStatistics.datetime];
            } else if (type == "newVisitis") {
                this.lineChartData = this.newVisitStatistics;
                this.xData = [...this.newVisitStatistics.datetime];
            } else if (type == "emergency") {
                this.lineChartData = this.emergencyStatistics;
                this.xData = [...this.emergencyStatistics.datetime];
            }
        },
        fetchData() {
            this.getNewVisitStatistics();
            this.getRecentMonthFinance();
            this.getMessageStatistics();
            this.getEmergencyStatistics();
        },

        getRecentMonthFinance() {
            getRecentMonthFinance().then((res) => {
                var sum = 0;
                res.data.forEach((item) => {
                    sum = sum + Number(item.actualReceived);
                });
                this.finance = sum;

                let datetime = res.data.map((item) => {
                    return item.datetime;
                });
                let totalFee = res.data.map((item) => {
                    return item.totalFee;
                });
                let actualReceived = res.data.map((item) => {
                    return item.actualReceived;
                });
                this.financeStatistics = {
                    datetime,
                    expect: totalFee,
                    actual: actualReceived,
                    describe: ["订单总额", "实际支付"],
                };
            });
        },

        getNewVisitStatistics() {
            getNewVisitStatistics().then((res) => {
                this.newVisits = res.data;
                var sum = 0;
                res.data.forEach((item) => {
                    sum = sum + item.num;
                });
                this.newVisits = sum;
                let datetime = res.data.map((item) => {
                    return item.datetime;
                });
                let num = res.data.map((item) => {
                    return item.num;
                });
                this.newVisitStatistics = {
                    datetime,
                    actual: num,
                    describe: ["", "新用户数量"],
                };
                this.handleSetLineChartData("newVisitis");
            });
        },

        getMessageStatistics() {
            getMessageStatistics().then((res) => {
                var sum = 0;
                res.data.forEach((item) => {
                    sum = sum + item.num;
                });
                this.messageNum = sum;

                let datetime = res.data.map((item) => {
                    return item.datetime;
                });
                let num = res.data.map((item) => {
                    return item.num;
                });

                this.messageStatistics = {
                    datetime,
                    actual: num,
                    describe: ["", "消息数量"],
                };
            });
        },

        getEmergencyStatistics() {
            getEmergencyStatistics().then((res) => {
                var sum = 0;
                res.data.forEach((item) => {
                    sum = sum + item.num;
                });
                this.emergencyNum = sum;

                let datetime = res.data.map((item) => {
                    return item.datetime;
                });
                let num = res.data.map((item) => {
                    return item.num;
                });

                this.emergencyStatistics = {
                    datetime,
                    actual: num,
                    describe: ["", "呼救数量"],
                };
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
