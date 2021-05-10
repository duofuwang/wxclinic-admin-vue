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
            <el-form ref="form" :model="form" label-width="auto">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申请人昵称" prop="nickname">
                            <el-input
                                v-if="isEdit"
                                v-model="form.nickname"
                                placeholder="请输入申请人昵称"
                            />
                            <div v-else>{{ form.realName }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请人姓名" prop="realName">
                            <el-input
                                v-if="isEdit"
                                v-model="form.realName"
                                placeholder="请输入真实姓名"
                            />
                            <div v-else>{{ form.realName }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phoneNumber">
                            <el-input
                                v-if="isEdit"
                                v-model="form.phoneNumber"
                                placeholder="请输入手机号码"
                                maxlength="11"
                            />
                            <div v-else>{{ form.phoneNumber }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发起时间" prop="createTime">
                            <el-date-picker
                                v-if="isEdit"
                                clearable
                                v-model="form.createTime"
                                type="datetime"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd HH:mm"
                                :picker-options="dateOption"
                            />
                            <div v-else>{{ form.createTime }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预约时间" prop="time">
                            <el-date-picker
                                v-if="isEdit"
                                clearable
                                v-model="form.time"
                                type="datetime"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd HH:mm"
                                :picker-options="dateOption"
                            />
                            <div v-else>{{ form.time }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="applicationType === 2">
                        <el-form-item label="就诊地点" prop="address">
                            <el-input
                                v-if="isEdit"
                                v-model="form.address"
                                placeholder="请输入就诊地点"
                            />
                            <div v-else>{{ form.address }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="病情描述" prop="height">
                            <el-input
                                v-if="isEdit"
                                v-model="form.description"
                                type="textarea"
                                placeholder="病情描述"
                            >
                            </el-input>
                            <div v-else>
                                <div
                                    class="description-content padding-lr-xs border radius"
                                >
                                    <div v-html="form.description"></div>
                                </div>
                            </div>
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
    </div>
</template>

<script>

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
            default: "查看",
        },
        show: {
            type: Boolean,
            default: false,
        },
        isEdit: {
            type: Boolean,
            default: false,
        },
        applicationType: {
            type: Number,
            default: 1
        }
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
            console.log(this.form)
        },
        handleClose() {
            this.$emit("close", this.refresh);
            this.refresh = false;
        },
    },
};
</script>

<style scoped>
.description-content {
    max-height: 150px;
    overflow-y: scroll;
}
</style>>