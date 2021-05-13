<template>
    <div class="app-container">
        <el-form :model="searchForm" ref="searchForm" :inline="true">
            <el-form-item label="患者" prop="patientName">
                <el-input
                    v-model="searchForm.patientName"
                    placeholder="请输入患者姓名"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>

            <el-form-item label="医生" prop="doctorName">
                <el-input
                    placeholder="请输入医生姓名"
                    v-model="searchForm.doctorName"
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
                <router-link to="/record/create">
                    <el-button type="primary" icon="el-icon-plus"
                        >新增</el-button
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
                    align="center"
                    prop="patientName"
                    label="患者"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="patientAge"
                    label="年龄"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="patientAddress"
                    label="住址"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="chiefComplaint"
                    label="主诉"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="medicalHistory"
                    label="病史"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="doctorDiagnosis"
                    label="诊断"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="treatmentMethod"
                    label="治疗方法"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="prescription"
                    label="处方"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                    width="180px"
                    align="center"
                    prop="createTime"
                    label="诊疗时间"
                ></el-table-column>
                <el-table-column
                    align="center"
                    prop="doctorName"
                    label="医生"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/record/edit/' + scope.row.id">
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
import {
    getMedicalRecordList,
    deleteMedicalRecord,
} from "@/api/medical-record";
import PageTable from "@/components/PageTable/PageTable.vue";

export default {
    components: { PageTable },
    filters: {},
    data() {
        return {
            searchForm: {},
            range: [],
            selections: [],
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
            getMedicalRecordList(filter).then((res) => {
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
                "确认删除这" + this.selections.length + "个病历?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    var ids = this.selections.map((item) => item.id).join(",");
                    deleteMedicalRecord(ids).then((res) => {
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