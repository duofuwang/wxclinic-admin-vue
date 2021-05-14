<template>
    <div class="margin-sm">
        <el-form
            ref="recordForm"
            :model="recordForm"
            :rules="rules"
            label-width="100px"
        >
            <el-form-item label="患者姓名" prop="patientName">
                <el-input
                    v-model="recordForm.patientName"
                    placeholder="请输入患者姓名"
                    clearable
                    @clear="handleClear"
                    :style="{ width: '100%' }"
                    ><el-button
                        slot="append"
                        icon="el-icon-search"
                        type="primary"
                        @click="handleSelectUser"
                        >选择用户</el-button
                    >
                </el-input>
            </el-form-item>
            <el-form-item label="患者年龄" prop="patientAge">
                <el-input
                    v-model="recordForm.patientAge"
                    placeholder="请输入患者年龄"
                    clearable
                    :style="{ width: '100%' }"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="患者住址" prop="patientAddress">
                <el-input
                    v-model="recordForm.patientAddress"
                    placeholder="请输入患者住址"
                    clearable
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="医生" prop="doctorId">
                <el-select
                    v-model="recordForm.doctorId"
                    placeholder="请选择医生"
                    clearable
                    :style="{ width: '100%' }"
                >
                    <el-option
                        v-for="(item, index) in doctorOptions"
                        :key="index"
                        :label="item.doctorName"
                        :value="item.userId"
                        :disabled="item.disabled"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主诉" prop="chiefComplaint">
                <el-input
                    v-model="recordForm.chiefComplaint"
                    type="textarea"
                    placeholder="请输入主诉"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="患者病史" prop="medicalHistory">
                <el-input
                    v-model="recordForm.medicalHistory"
                    type="textarea"
                    placeholder="请输入患者病史"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="诊断" prop="doctorDiagnosis">
                <el-input
                    v-model="recordForm.doctorDiagnosis"
                    type="textarea"
                    placeholder="请输入诊断"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="治疗方法" prop="treatmentMethod">
                <el-input
                    v-model="recordForm.treatmentMethod"
                    type="textarea"
                    placeholder="请输入治疗方法"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="处方" prop="prescription">
                <el-input
                    v-model="recordForm.prescription"
                    type="textarea"
                    placeholder="请输入处方"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="诊疗日期" prop="createTime">
                <el-date-picker
                    type="datetime"
                    v-model="recordForm.createTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :style="{ width: '100%' }"
                    placeholder="请选择诊疗日期"
                    clearable
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item class="flex justify-end">
                <el-button type="primary" @click="submitForm">{{
                    isEdit ? "保存修改" : "提交"
                }}</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <select-user
            :show="isSelectUser"
            @select="selectUser"
            @close="handleClose"
        ></select-user>
    </div>
</template>
<script>
import { saveMedicalRecord, getMedicalRecordById } from "@/api/medical-record";
import { getAllAdminList } from "@/api/admin";
import util from "@/utils/util";
import SelectUser from "./SelectUser.vue";
export default {
    components: { SelectUser },
    props: {
        isEdit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            recordForm: {
                userId: undefined,
                patientName: undefined,
                patientAge: undefined,
                patientAddress: undefined,
                doctorId: undefined,
                chiefComplaint: undefined,
                medicalHistory: undefined,
                doctorDiagnosis: undefined,
                treatmentMethod: undefined,
                prescription: undefined,
                createTime: null,
            },
            rules: {
                patientName: [
                    {
                        required: true,
                        message: "请输入患者姓名",
                        trigger: "change",
                    },
                ],
                patientAge: [
                    {
                        required: true,
                        message: "请输入患者年龄",
                        trigger: "blur",
                    },
                ],
                patientAddress: [
                    {
                        required: true,
                        message: "请输入患者住址",
                        trigger: "blur",
                    },
                ],
                doctorId: [
                    {
                        required: true,
                        message: "请选择医生",
                        trigger: "change",
                    },
                ],
                chiefComplaint: [
                    {
                        required: true,
                        message: "请输入主诉",
                        trigger: "blur",
                    },
                ],
                medicalHistory: [],
                doctorDiagnosis: [
                    {
                        required: true,
                        message: "请输入诊断",
                        trigger: "blur",
                    },
                ],
                treatmentMethod: [
                    {
                        required: true,
                        message: "请输入治疗方法",
                        trigger: "blur",
                    },
                ],
                prescription: [
                    {
                        required: true,
                        message: "请输入处方",
                        trigger: "blur",
                    },
                ],
                createTime: [
                    {
                        required: true,
                        message: "请选择诊疗日期",
                        trigger: "change",
                    },
                ],
            },
            doctorOptions: [],
            isSelectUser: false,
        };
    },
    computed: {},
    watch: {},
    created() {
        this.getDoctorList();
        if (this.isEdit) {
            const id = this.$route.params && this.$route.params.id;
            this.fetchData(id);
        }
    },
    mounted() {},
    methods: {
        fetchData(id) {
            getMedicalRecordById(id).then((res) => {
                if (res.success) {
                    this.recordForm = res.data;
                }
            });
        },

        submitForm() {
            this.$refs["recordForm"].validate((valid) => {
                if (!valid) {
                    this.$message.warning("请输入必要项");
                    return;
                }
                // TODO 提交表单
                console.log(this.recordForm);
                saveMedicalRecord(this.recordForm).then((res) => {
                    console.log(res);
                    if (res.success) {
                        this.$message.success("病历保存成功");
                        this.$router.push("/record/list");
                    }
                });
            });
        },
        resetForm() {
            this.$refs["recordForm"].resetFields();
        },

        getDoctorList() {
            getAllAdminList().then((res) => {
                this.doctorOptions = res.data;
            });
        },

        handleSelectUser() {
            this.isSelectUser = true;
        },

        handleClear() {
            this.recordForm.userId = undefined;
        },

        // 关闭对话框
        handleClose() {
            this.isSelectUser = false;
        },

        // 选择账户
        selectUser(user) {
            this.recordForm.patientName = util.isEmpty(user.realName)
                ? user.nickname
                : user.realName;
            this.recordForm.userId = user.id;
            if (!util.isEmpty(user.birthday)) {
                this.recordForm.patientAge = util.getAge(user.birthday)[0];
            }
            this.handleClose();
        },
    },
};
</script>
<style>
</style>
