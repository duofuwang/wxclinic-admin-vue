<template>
    <div class="app-container">
        <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item label="作者" prop="author">
                <el-input
                    v-model="searchForm.author"
                    placeholder="请输入作者"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>

            <el-form-item label="标题" prop="title">
                <el-input
                    placeholder="请输入标题"
                    v-model="searchForm.title"
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

            <el-form-item label="类型 " prop="articleType">
                <el-cascader
                    v-model="articleType"
                    placeholder="请选择文章类型"
                    :options="articleTypeList"
                    :props="cascaderProps"
                    @change="handleCascaderChange"
                ></el-cascader>
            </el-form-item>

            <el-form-item label="状态 " prop="status">
                <el-select
                    v-model="searchForm.status"
                    placeholder="请选择发表状态"
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
                <router-link to="/article/create">
                    <el-button type="primary" icon="el-icon-plus"
                        >发布</el-button
                    >
                </router-link>
            </el-col>
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
                    min-width="200px"
                    prop="title"
                    label="标题"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="{ row }">
                        <router-link
                            :to="'/article/edit/' + row.id"
                            class="link-type"
                        >
                            <span>{{ row.title }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="author"
                    label="作者"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="summary"
                    label="摘要"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column align="center" prop="type" label="类型"
                    ><template slot-scope="{ row }">
                        {{ row.type }}
                    </template></el-table-column
                >
                <el-table-column align="center" prop="status" label="状态"
                    ><template slot-scope="{ row }">
                        <el-tag :type="row.status | statusTypeFilter">
                            {{ row.status | statusFilter }}
                        </el-tag>
                    </template></el-table-column
                >
                <el-table-column align="center" prop="banner" label="头图">
                    <template slot-scope="{ row }">
                        <el-image
                            v-if="row.banner != null"
                            :src="row.banner"
                            fit="cover"
                            style="width: 45px; height: 45px"
                            :preview-src-list="[row.banner]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                    width="180px"
                    align="center"
                    prop="createTime"
                    label="发表时间"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/article/edit/' + scope.row.id">
                            <el-button type="primary" icon="el-icon-edit">
                                编辑
                            </el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </template>
        </page-table>
    </div>
</template>

<script>
import { getArticleList, deleteArticle } from "@/api/article";
import { getArticleTypeList } from "@/api/articletype";
import PageTable from "@/components/PageTable/PageTable.vue";

export default {
    components: { PageTable },
    filters: {
        statusFilter(status) {
            if (status === 0) return "草稿";
            if (status === 1) return "已发布";
            return "已发布";
        },
        statusTypeFilter(status) {
            if (status === 0) return "info";
            if (status === 1) return "success";
            return "info";
        },
    },
    data() {
        return {
            searchForm: {},
            range: [],
            selections: [],
            // 文章状态
            statusOptions: [
                {
                    value: 0,
                    label: "草稿",
                },
                {
                    value: 1,
                    label: "已发布",
                },
            ],
            articleType: [],
            articleTypeList: [],
            cascaderProps: {
                value: "id",
                label: "type",
                children: "children",
                expandTrigger: "hover",
            },
        };
    },
    computed: {
        multiple() {
            return this.selections.length > 0;
        },
    },
    mounted() {
        this.getArticleTypeList();
    },
    methods: {
        // 加载数据
        loadTableData(filter, callback) {
            filter = {
                ...filter,
                ...this.searchForm,
                startDate: this.range[0],
                endDate: this.range[1],
            };
            getArticleList(filter).then((res) => {
                this.total = res.data.total;
                const tableData = {
                    ...res.data,
                    data: res.data.records,
                };
                callback(tableData);
            });
        },

        // 获取文章类型列表
        getArticleTypeList() {
            getArticleTypeList().then((res) => {
                this.articleTypeList = this.getTreeData(res.data);
            });
        },

        // 递归判断列表，把最后的children设为undefined，解决最后一级空级联bug
        getTreeData(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].children.length < 1) {
                    // children若为空数组，则将children设为undefined
                    data[i].children = undefined;
                } else {
                    // children若不为空数组，则继续 递归调用 本方法
                    this.getTreeData(data[i].children);
                }
            }
            return data;
        },

        handleCascaderChange(val) {
            this.searchForm.type = val[val.length - 1];
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

        // 批量删除
        handleMultiDelete() {
            this.$confirm(
                "确认删除这" + this.selections.length + "个文章?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    var ids = this.selections.map((item) => item.id).join(",");
                    deleteArticle(ids).then((res) => {
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