<template>
    <div>
        <!-- 查看、修改对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="visible"
            width="650px"
            @close="handleClose"
            append-to-body
        >
            <el-form ref="form" :model="form" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input
                                v-if="isEdit"
                                v-model="form.nickname"
                                placeholder="请输入用户昵称"
                            />
                            <div v-else>{{ form.nickname }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="realName">
                            <el-input
                                v-if="isEdit"
                                v-model="form.realName"
                                placeholder="请输入真实姓名"
                            />
                            <div v-else>{{ form.realName }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="留言时间" prop="createTime">
                            <el-date-picker
                                v-if="isEdit"
                                clearable
                                v-model="form.createTime"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                                :picker-options="dateOption"
                            />
                            <div v-else>{{ form.createTime }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="留言" prop="message">
                            <el-input
                                type="textarea"
                                v-if="isEdit"
                                v-model="form.message"
                                placeholder="请输入留言"
                            >
                            </el-input>
                            <div v-else v-html="form.message"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmit" v-if="isEdit"
                    >确 定</el-button
                >
                <el-button @click="handleClose" v-if="isEdit">取 消</el-button>
                <el-button @click="handleClose" v-if="!isEdit">返 回</el-button>
            </div>
        </el-dialog>

        <!-- 查看图片 -->
        <el-dialog :visible.sync="dialogVisible" width="400px">
            <div class="flex justify-center">
                <img width="100%" :src="dialogImageUrl" alt="" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { upload } from "@/api/obs";
import { save } from "@/api/user";

export default {
    props: {
        form: {
            type: Object,
            default: () => {
                return {};
            },
        },
        title: {
            type: String,
            default: "编辑",
        },
        show: {
            type: Boolean,
            default: false,
        },
        isEdit: {
            type: Boolean,
            default: false,
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
            dialogImageUrl: "",
            dialogVisible: false,
            disabled: false,

            refresh: false,

            // 日期选项
            dateOption: {
                // 禁用未来的日期
                disabledDate: (time) => {
                    return time.getTime() > new Date().getTime();
                },
            },
        };
    },

    methods: {
        handleSubmit() {
            save(this.form).then((res) => {
                if (res.success) {
                    this.refresh = true;
                    this.handleClose();
                }
            });
        },
        handleClose() {
            this.$emit("close", this.refresh);
            this.refresh = false;
        },

        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },

        handelUpload(param) {
            var formData = new FormData();
            // 添加参数
            formData.append("file", param.file);
            upload(formData)
                .then((res) => {
                    console.log(res);
                    this.form.avatarUrl = res.data;
                })
                .catch((err) => {});
        },

        handleRadioChange() {
            console.log(this.form.gender);
        },
    },
};
</script>

<style scoped>
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

::v-deep .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.avatar {
    width: 80px;
    height: 80px;
    display: block;
}
</style>>