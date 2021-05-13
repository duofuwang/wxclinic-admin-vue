<template>
    <div>
        <el-dialog
            title="选择用户"
            width="700px"
            :visible.sync="visible"
            @close="handleClose"
        >
            <el-form :model="searchForm" ref="searchForm" :inline="true">
                <el-form-item label="昵称" prop="nickname">
                    <el-input
                        v-model="searchForm.nickname"
                        placeholder="请输入用户昵称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </el-form-item>

                <el-form-item label="姓名" prop="realName">
                    <el-input
                        placeholder="请输入姓名"
                        v-model="searchForm.realName"
                        size="small"
                        clearable
                        @keyup.enter.native="handleQuery"
                    ></el-input>
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
                        prop="avatarUrl"
                        label="头像"
                    >
                        <template slot-scope="scope">
                            <el-avatar :src="scope.row.avatarUrl"></el-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="nickname"
                        label="昵称"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="realName"
                        label="姓名"
                    ></el-table-column>
                    <el-table-column align="center" prop="gender" label="性别">
                        <template slot-scope="scope">{{
                            scope.row.gender === 1 ? "男" : "女"
                        }}</template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="phoneNumber"
                        label="手机号码"
                    ></el-table-column>
                    <el-table-column
                        align="center"
                        prop="birthday"
                        label="出生日期"
                    ></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                @click="handleSelect(scope.row)"
                                >选择</el-button
                            >
                        </template>
                    </el-table-column>
                </template>
            </page-table>
        </el-dialog>
    </div>
</template>

<script>
import PageTable from "@/components/PageTable/PageTable.vue";
import { getUserList } from "@/api/user";
export default {
    components: { PageTable },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        show() {
            this.visible = this.show;
        },
    },
    data() {
        return {
            visible: this.show,
            searchForm: {},
        };
    },
    methods: {
        // 加载数据
        loadTableData(filter, callback) {
            filter = {
                ...filter,
                ...this.searchForm,
            };

            getUserList(filter).then((res) => {
                this.total = res.data.total;
                const tableData = {
                    ...res.data,
                    data: res.data.records,
                };
                callback(tableData);
            });
        },
        handleClose() {
            this.$emit("close", this.refresh);
        },

        // 重载表格
        reload() {
            this.$refs.dataTable.loadTableData("reload");
        },

        // 搜索
        handleQuery() {
            console.log(this.searchForm);
            this.reload();
        },

        // 重置搜索参数
        resetQuery() {
            this.searchForm = {};
            this.reload();
        },

        handleSelect(row) {
            this.$emit("select", row);
        },
    },
};
</script>

<style>
</style>