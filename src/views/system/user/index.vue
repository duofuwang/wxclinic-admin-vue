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
                <el-table-column align="center" prop="avatarUrl" label="头像">
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
                <el-table-column
                    align="center"
                    prop="height"
                    label="身高（cm）"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="weight"
                    label="体重（kg）"
                ></el-table-column>
                <!-- <el-table-column
          align="center"
          prop="province"
          label="省份"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="city"
          label="城市"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="district"
          label="地区"
        ></el-table-column> -->
                <el-table-column
                    align="center"
                    prop="lastVisitTime"
                    label="上次登录时间"
                ></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleStatusChange(scope.row)"
                        />
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
                            icon="el-icon-edit"
                            @click="handleEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            >删除</el-button
                        >
                        <el-button
                            type="text"
                            icon="el-icon-star-off"
                            @click="handleSetAdmin(scope.row)"
                            >设为管理</el-button
                        >
                    </template>
                </el-table-column>
            </template>
        </page-table>

        <!-- 查看、修改对话框 -->
        <user-dialog
            :title="dialogTitle"
            :show="showUserDialog"
            :form="form"
            :isEdit="isEdit"
            @close="handleClose"
        ></user-dialog>
    </div>
</template>

<script>
import { getUserList, getUserById, changeStatus, deleteUser } from "@/api/user";
import { isAdmin, saveAdmin } from "@/api/admin";
import PageTable from "@/components/PageTable/PageTable.vue";
import UserDialog from "./compoments/UserDialog.vue";

export default {
    components: { PageTable, UserDialog },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: "success",
                draft: "gray",
                deleted: "danger",
            };
            return statusMap[status];
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
            getUserById(row.id).then((res) => {
                if (res.success) {
                    this.form = res.data;
                    this.dialogTitle = "查看";
                    this.showUserDialog = true;
                    this.isEdit = false;
                }
            });
        },

        // 编辑
        handleEdit(row) {
            getUserById(row.id).then((res) => {
                if (res.success) {
                    this.form = res.data;
                    this.dialogTitle = "编辑";
                    this.showUserDialog = true;
                    this.isEdit = true;
                }
            });
        },

        // 删除
        handleDelete(row) {
            this.$confirm('确认删除"' + row.nickname + '"这个用户?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    deleteUser(row.id).then((res) => {
                        if (res.success) {
                            this.$message.success("删除成功");
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
