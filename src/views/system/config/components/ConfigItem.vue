<template>
    <el-form label-width="80px" :model="config" ref="configForm" :rules="rules">
        <el-form-item label="诊所名称" prop="name">
            <el-input v-model="config.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
            <el-input v-model="config.tel"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
            <el-input v-model="config.address"></el-input>
        </el-form-item>
        <el-form-item label="出诊费用" prop="applicationFee">
            <el-input v-model="config.applicationFee"
                ><template slot="append">元</template></el-input
            >
        </el-form-item>
        <el-form-item label="关于" prop="about">
            <el-input v-model="config.about" type="textarea" rows="5"></el-input>
        </el-form-item>
        <el-form-item class="flex justify-end">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="clearForm">清空</el-button>
            <el-button type="success" @click="handleReset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { saveConfig } from "@/api/config";
export default {
    props: {
        config: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入诊所名称",
                        trigger: "change",
                    },
                ],
                tel: [
                    {
                        required: true,
                        message: "请输入电话",
                        trigger: "change",
                    },
                ],
                address: [
                    {
                        required: true,
                        message: "请输入地址",
                        trigger: "change",
                    },
                ],
                applicationFee: [
                    {
                        required: true,
                        message: "请输入出诊费用",
                        trigger: "change",
                    },
                ],
                about: [
                    {
                        required: true,
                        message: "请输入关于",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    methods: {
        handleSubmit() {
            this.$refs["configForm"].validate((valid) => {
                if (!valid) {
                    this.$message.warning("请输入必要项");
                    return;
                }
                saveConfig(this.config).then((res) => {
                    if (res.success) {
                        this.$message.success("保存成功");
                    }
                });
            });
        },
        clearForm() {
            this.$refs.configForm.resetFields();
        },
        handleReset() {
            this.$emit("reset");
        },
    },
};
</script>

<style>
</style>