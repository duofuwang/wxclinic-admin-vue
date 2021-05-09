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
                    placeholder="请输入姓名"
                    v-model="searchForm.realName"
                    size="small"
                    clearable
                    @keyup.enter.native="handleQuery"
                ></el-input>
            </el-form-item>

            <el-form-item label="状态 " prop="status">
                <el-select
                    v-model="searchForm.status"
                    placeholder="请选择账号状态"
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
                    prop="description"
                    label="病情描述"
                ></el-table-column>
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
        <admin-dialog
            :title="dialogTitle"
            :show="showUserDialog"
            :form="form"
            :isEdit="isEdit"
            @close="handleClose"
        />
    </div>
</template>

<script>
import { getUserById, changeStatus, deleteUser } from "@/api/user";
import { getApplicationList, approve, reject, getApplicationById } from "@/api/application";
import { isAdmin, saveAdmin } from "@/api/admin";
import PageTable from "@/components/PageTable/PageTable.vue";
import AdminDialog from "@/views/system/admin/components/AdminDialog.vue";

export default {
    components: { PageTable, AdminDialog },
    filters: {
        statusFilter(status) {
            if (status === 1) return "通过";
            if (status === 0) return "拒绝";
            if (status === -1) return "撤销";
            return "待审核";
        },
        statusTypeFilter(status) {
            if (status === 1) return "success";
            if (status === 0) return "danger";
            if (status === -1) return "info";
            return "warning";
        },
    },
    data() {
        return {
            searchForm: {},
            showUserDialog: false,
            isEdit: false,
            form: {},
            dialogTitle: "",
            selections: [],
            // 账号状态
            statusOptions: [
                {
                    value: 1,
                    label: "启用",
                },
                {
                    value: 0,
                    label: "禁用",
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
                type: 1,
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
            this.reload();
        },

        // 对话框关闭
        handleClose(refresh) {
            this.showUserDialog = false;
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

        // 更改账户状态
        handleStatusChange(row) {
            const text = row.status === 1 ? "启用" : "停用";
            this.$confirm(
                "确认要" + text + "用户  " + row.nickname + "  吗?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    changeStatus(row.id, row.status).then((res) => {
                        if (res.success) {
                            this.$message.success(text + "成功");
                        }
                    });
                })
                .catch(() => {
                    row.status = row.status === 1 ? 0 : 1;
                });
        },

        // 查看
        handleInfo(row) {
            getApplicationById(row.id).then((res) => {
                if (res.success) {
                    this.form = res.data;
                    this.dialogTitle = "查看";
                    this.showUserDialog = true;
                    this.isEdit = false;
                }
            });
        },

        // 通过
        handleApprove(row) {
            this.$confirm('确认通过"' + row.nickname + '"这个申请?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    approve(row.id).then((res) => {
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
            this.$confirm('确认拒绝"' + row.nickname + '"这个申请?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    reject(row.id).then((res) => {
                        if (res.success) {
                            this.$message.success("拒绝成功");
                            this.reload();
                        }
                    });
                })
                .catch(() => {});
        },

        // 设为管理
        handleSetAdmin(row) {
            isAdmin({ userId: row.id }).then((res) => {
                if (res.data) {
                    this.$message.warning("该用户已经是管理员");
                    return;
                }
                this.$prompt("为用户设置登录密码", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputPattern: /^.{6,16}$/,
                    inputErrorMessage: "密码在6-16位",
                })
                    .then(({ value }) => {
                        saveAdmin({
                            userId: row.id,
                            password: value,
                            level: 0,
                        }).then((res) => {
                            if (res.success) {
                                this.$message.success(
                                    "设置管理员成功！密码是: " + value
                                );
                            }
                        });
                    })
                    .catch(() => {});
            });
        },

        // 批量删除
        handleMultiDelete() {
            this.$confirm(
                "确认删除这" + this.selections.length + "个用户?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    var ids = this.selections.map((item) => item.id).join(",");
                    deleteUser(ids).then((res) => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.reload();
                        }
                    });
                })
                .catch(() => {});
        },

        // 是否为管理员
        isAdmin(userId) {
            return false;
        },
    },
};
</script>
