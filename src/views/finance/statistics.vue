<template>
    <div class="app-container">
        <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item label="统计方式" prop="sortBy">
                <el-select v-model="sortBy" placeholder="请选择统计方式">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="日期" prop="range">
                <el-date-picker
                    v-model="range"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="handleQuery"
                    >搜索</el-button
                >
                <el-button icon="el-icon-refresh" @click="resetQuery"
                    >重置</el-button
                >
            </el-form-item>
        </el-form>

        <page-table
            ref="dataTable"
            row-key="id"
            :border="true"
            :showSelection="false"
            @load-table-data="loadTableData"
        >
            <template slot="tb-columns">
                <el-table-column
                    align="center"
                    prop="datetime"
                    label="时间"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="totalFee"
                    label="总额(元)"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="actualReceived"
                    label="实际支付(元)"
                    :show-overflow-tooltip="true"
                ></el-table-column>
            </template>
        </page-table>
    </div>
</template>

<script>
import { getFinanceStatisticsList } from "@/api/finance";
import PageTable from "@/components/PageTable/PageTable.vue";

export default {
    components: { PageTable },
    filters: {},
    data() {
        return {
            searchForm: {},
            sortBy: "day", // day week month year
            range: [],
            options: [
                {
                    value: "day",
                    label: "按天划分",
                },
                {
                    value: "week",
                    label: "按周划分",
                },
                {
                    value: "month",
                    label: "按月划分",
                },
                {
                    value: "year",
                    label: "按年划分",
                },
            ],
        };
    },
    mounted() {},
    methods: {
        // 加载数据
        loadTableData(filter, callback) {
            filter = {
                ...filter,
                ...this.searchForm,
                startDate: this.range[0],
                endDate: this.range[1],
                sortBy: this.sortBy,
            };
            getFinanceStatisticsList(filter).then((res) => {
                this.total = res.data.total;
                const tableData = {
                    ...res.data,
                    data: res.data.records,
                };
                callback(tableData);
            });
        },

        // 搜索
        handleQuery() {
            this.reload();
        },

        // 重置搜索参数
        resetQuery() {
            this.searchForm = {};
            this.range = [];
            this.sortBy = 'day'
            this.reload();
        },

        // 重载表格
        reload() {
            this.$refs.dataTable.loadTableData("reload");
        },
    },
};
</script>