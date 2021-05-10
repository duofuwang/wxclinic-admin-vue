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

            <el-form-item label="日期 " prop="range">
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
                    placeholder="请选择呼救状态"
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
                    label="昵称"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="realName"
                    label="姓名"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="phoneNumber"
                    label="手机号码"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="message"
                    label="信息"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="location"
                    label="位置"
                ></el-table-column>
                <el-table-column align="center" prop="remark" label="备注">
                    <template slot-scope="scope">{{
                        scope.row.remark
                    }}</template></el-table-column
                >
                <el-table-column
                    align="center"
                    prop="createTime"
                    label="发起时间"
                ></el-table-column>
                <el-table-column align="center" prop="gender" label="状态">
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
                            @click="handleStop(scope.row)"
                            >结束</el-button
                        >
                    </template>
                </el-table-column>
            </template>
        </page-table>

        <!-- 查看、修改对话框 -->
        <emergency-dialog
            :title="dialogTitle"
            :show="showEmergencyDialog"
            :form="form"
            :isEdit="isEdit"
            @close="handleClose"
        ></emergency-dialog>
    </div>
</template>

<script>
import {
    getEmergencyList,
    stop,
    deleteEmergency,
    getEmergencyById,
} from "@/api/emergency";
import PageTable from "@/components/PageTable/PageTable.vue";
import EmergencyDialog from "./components/EmergencyDialog.vue";

export default {
    components: { PageTable, EmergencyDialog },
    filters: {
        statusFilter(status) {
            if (status === 1) return "呼救中";
            if (status === 2) return "已结束";
            return "已结束";
        },
        statusTypeFilter(status) {
            if (status === 1) return "warning";
            if (status === 2) return "info";
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
            showEmergencyDialog: false,
            isEdit: false,
            form: {},
            dialogTitle: "",
            selections: [],
            applicationType: 1,
            // 呼救状态
            statusOptions: [
                {
                    value: 1,
                    label: "呼救中",
                },
                {
                    value: 2,
                    label: "已结束",
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

            getEmergencyList(filter).then((res) => {
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
            this.showEmergencyDialog = false;
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
            getEmergencyById(row.id).then((res) => {
                if (res.success) {
                    this.form = res.data;
                    this.dialogTitle = "查看";
                    this.showEmergencyDialog = true;
                    this.isEdit = false;
                }
            });
        },

        // 通过
        handleStop(row) {
            this.$confirm(
                "确认结束 " + row.nickname + " 的紧急呼救吗?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    stop(row.id).then((res) => {
                        if (res.success) {
                            this.$message.success("结束成功");
                            this.reload();
                        }
                    });
                })
                .catch(() => {});
        },

        // 批量删除
        handleMultiDelete() {
            this.$confirm(
                "确认删除这" + this.selections.length + "个呼救申请?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    var ids = this.selections.map((item) => item.id).join(",");
                    deleteEmergency(ids).then((res) => {
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