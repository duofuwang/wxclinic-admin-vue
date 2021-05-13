<template>
    <el-dialog title="重置密码" :visible.sync="visible" @close="handleClose">
        <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            label-width="100px"
        >
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input
                    v-model="formData.oldPassword"
                    placeholder="请输入旧密码"
                    clearable
                    show-password
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input
                    v-model="formData.newPassword"
                    placeholder="请输入新密码"
                    clearable
                    show-password
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { resetPwd } from "@/api/admin";
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: String,
            default: "",
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
            formData: {
                oldPassword: undefined,
                newPassword: undefined,
            },
            rules: {
                oldPassword: [
                    {
                        required: true,
                        message: "请输入旧密码",
                        trigger: "blur",
                    },
                ],
                newPassword: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: "blur",
                    },
                    {
                        pattern: /^.{6,16}$/,
                        message: "长度在6到16位之间",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        submitForm() {
            this.$refs["elForm"].validate((valid) => {
                if (!valid) return;
                // TODO 提交表单
                resetPwd({
                    userId: this.userId,
                    ...this.formData,
                }).then((res) => {
                    if (res.success) {
                        this.$message.success(
                            "密码重置成功！新密码是：" +
                                this.formData.newPassword
                        );
                        this.handleClose();
                    }
                });
            });
        },
        handleClose() {
            this.$emit("close");
            this.formData = {};
        },
    },
};
</script>

<style>
</style>