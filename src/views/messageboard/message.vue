<template>
    <div class="app-container">
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
                    placeholder="请输入用户姓名"
                    v-model="searchForm.realName"
                    size="small"
                    clearable
                    @keyup.enter.native="handleQuery"
                ></el-input>
            </el-form-item>

            <el-form-item label="日期 " prop="range">
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
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="realName"
                    label="姓名"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="message"
                    label="留言"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    width="180px"
                    align="center"
                    prop="createTime"
                    label="留言时间"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{ row }">
                        <el-button
                            type="text"
                            icon="el-icon-search"
                            @click="handleInfo(row)"
                        >
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </template>
        </page-table>

        <message-dialog
            :title="dialogTitle"
            :show="dialogVisible"
            :form="message"
            @close="handleClose"
        ></message-dialog>
    </div>
</template>

<script>
import { getMessageBoardList, deleteMessageBoard, getMessageBoardById } from "@/api/message-board";
import PageTable from "@/components/PageTable/PageTable.vue";
import MessageDialog from "./components/MessageDialog.vue";

export default {
    components: { PageTable, MessageDialog },
    filters: {},
    data() {
        return {
            searchForm: {},
            range: [],
            selections: [],
            dialogVisible: false,
            dialogTitle: "",
            message: {},
        };
    },
    computed: {
        multiple() {
            return this.selections.length > 0;
        },
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
            };
            getMessageBoardList(filter).then((res) => {
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
            this.articleType = [];
            this.reload();
        },

        // 对话框关闭
        handleClose() {
            this.dialogVisible = false;
        },

        // 重载表格
        reload() {
            this.$refs.dataTable.loadTableData("reload");
        },

        // 查看
        handleInfo(row) {
            getMessageBoardById(row.id).then((res) => {
                this.message = res.data;
                this.dialogTitle = "查看";
                this.dialogVisible = true;
            });
        },

        // 多选
        handleSelectionChange(val) {
            this.selections = val;
        },

        // 批量删除
        handleMultiDelete() {
            this.$confirm(
                "确认删除这" + this.selections.length + "个留言?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    var ids = this.selections.map((item) => item.id).join(",");
                    deleteMessageBoard(ids).then((res) => {
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