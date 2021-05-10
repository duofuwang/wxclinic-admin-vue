<template>
    <div class="app-container">
        <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item label="昵称" prop="nickname">
                <el-input
                    v-model="searchForm.nickname"
                    placeholder="请输入昵称"
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

            <el-form-item label="手机号" prop="phoneNumber">
                <el-input
                    placeholder="请输入手机号"
                    v-model="searchForm.phoneNumber"
                    size="small"
                    clearable
                    @keyup.enter.native="handleQuery"
                ></el-input>
            </el-form-item>

            <el-form-item label="日期 " prop="status">
                <el-date-picker
                    v-model="range"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="状态 " prop="status">
                <el-select
                    v-model="searchForm.status"
                    placeholder="请选择审核状态"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                >
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
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

        <el-row :gutter="10" class="margin-bottom-sm">
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    :disabled="!multiple"
                    @click="handleMultiDelete"
                    >删除</el-button
                >
            </el-col>
        </el-row>

        <page-table
            ref="dataTable"
            row-key="id"
            :border="true"
            @load-table-data="loadTableData"
            @selection-change="handleSelectionChange"
        >
            <template slot="tb-columns">
                <el-table-column
                    align="center"
                    prop="nickname"
                    label="申请人昵称"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="realName"
                    label="申请人姓名"
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
                    prop="time"
                    label="预约时间"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="address"
                    label="地点"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="description"
                    label="病情描述"
                    ><template slot-scope="scope">{{
                        scope.row.description | descriptionFilter
                    }}</template></el-table-column
                >
                <el-table-column
                    align="center"
                    prop="createTime"
                    label="发起时间"
                ></el-table-column>
                <el-table-column align="center" prop="status" label="状态">
                    <template slot-scope="{ row }">
                        <el-tag :type="row.status | statusTypeFilter">
                            {{ row.status | statusFilter }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleInfo(scope.row)"
                            >查看</el-button
                        >
                        <el-button
                            type="text"
                            icon="el-icon-check"
                            @click="handleApprove(scope.row)"
                            >通过</el-button
                        >
                        <el-button
                            type="text"
                            icon="el-icon-close"
                            @click="handleReject(scope.row)"
                            >拒绝</el-button
                        >
                    </template>
                </el-table-column>
            </template>
        </page-table>

        <!-- 查看、修改对话框 -->
        <application-dialog
            :title="dialogTitle"
            :show="showApplicationDialog"
            :form="form"
            :isEdit="isEdit"
            :applicationType="applicationType"
            @close="handleClose"
        ></application-dialog>
    </div>
</template>

<script>
import {
    getApplicationList,
    approve,
    reject,
    getApplicationById,
    deleteApplication,
} from "@/api/application";
import PageTable from "@/components/PageTable/PageTable.vue";
import ApplicationDialog from "../components/ApplicationDialog.vue";

export default {
    components: { PageTable, ApplicationDialog },
    filters: {
        statusFilter(status) {
            if (status === 0) return "待审核";
            if (status === 1) return "通过";
            if (status === 2) return "拒绝";
            if (status === 3) return "撤销";
            return "待审核";
        },
        statusTypeFilter(status) {
            if (status === 0) return "warning";
            if (status === 1) return "success";
            if (status === 2) return "danger";
            if (status === 3) return "info";
            return "warning";
        },
        descriptionFilter(description) {
            return description.replace(/<br\/>/g, " ");
        },
    },
    data() {
        return {
            searchForm: {},
            range: [],
            showApplicationDialog: false,
            isEdit: false,
            form: {},
            dialogTitle: "",
            selections: [],
            applicationType: 2,
            // 审核状态
            statusOptions: [
                {
                    value: 0,
                    label: "待审核",
                },
                {
                    value: 1,
                    label: "通过",
                },
                {
                    value: 2,
                    label: "拒绝",
                },
                {
                    value: 3,
                    label: "撤销",
                },
            ],
        };
    },
    computed: {
        multiple() {
            return this.selections.length > 0;
        },
    },
    methods: {
        // 加载数据
        loadTableData(filter, callback) {
            filter = {
                ...filter,
                ...this.searchForm,
                type: this.applicationType,
                startDate: this.range[0],
                endDate: this.range[1],
            };

            getApplicationList(filter).then((res) => {
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
            console.log(this.searchForm);
            this.reload();
        },

        // 重置搜索参数
        resetQuery() {
            this.searchForm = {};
            this.range = [];
            this.reload();
        },

        // 对话框关闭
        handleClose(refresh) {
            this.showApplicationDialog = false;
            if (refresh) {
                this.reload();
            }
        },

        // 重载表格
        reload() {
            this.$refs.dataTable.loadTableData("reload");
        },

        // 多选
        handleSelectionChange(val) {
            this.selections = val;
        },

        // 查看
        handleInfo(row) {
            getApplicationById(row.id).then((res) => {
                if (res.success) {
                    this.form = res.data;
                    this.dialogTitle = "查看";
                    this.showApplicationDialog = true;
                    this.isEdit = false;
                }
            });
        },

        // 通过
        handleApprove(row) {
            this.$prompt('确认通过 "' + row.nickname + '" 的出诊申请?', "提示", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPlaceholder: "输入备注（可选）",
            })
                .then(({ value }) => {
                    approve(row.id, value).then((res) => {
                        if (res.success) {
                            this.$message.success("通过成功");
                            this.reload();
                        }
                    });
                })
                .catch(() => {});
        },

        // 拒绝
        handleReject(row) {
            this.$prompt('确认拒绝 "' + row.nickname + '" 的出诊申请?', "提示", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPlaceholder: "输入备注（可选）",
            })
                .then(({ value }) => {
                    reject(row.id, value).then((res) => {
                        if (res.success) {
                            this.$message.success("拒绝成功");
                            this.reload();
                        }
                    });
                })
                .catch(() => {});
        },

        // 批量删除
        handleMultiDelete() {
            this.$confirm(
                "确认删除这" + this.selections.length + "个预约申请?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    var ids = this.selections.map((item) => item.id).join(",");
                    deleteApplication(ids).then((res) => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.reload();
                        }
                    });
                })
                .catch(() => {});
        },
    },
};
</script>
