<template>
    <div class="margin">
        <el-form
            ref="postForm"
            :model="postForm"
            :rules="rules"
            label-width="80px"
            label-position="left"
        >
            <el-form-item label="标题" prop="title">
                <el-input
                    v-model="postForm.title"
                    placeholder="请输入标题"
                    :maxlength="50"
                    show-word-limit
                    clearable
                    :style="{ width: '100%' }"
                ></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
                <el-input
                    v-model="postForm.summary"
                    placeholder="请输入摘要"
                    :maxlength="200"
                    show-word-limit
                    clearable
                    :style="{ width: '100%' }"
                >
                </el-input>
            </el-form-item>
            <el-row type="flex" justify="start" align="middle" :gutter="15">
                <el-col :span="8">
                    <el-form-item label="作者" prop="userId">
                        <el-select
                            v-model="postForm.userId"
                            filterable
                            placeholder="请选择作者"
                        >
                            <el-option
                                v-for="item in authorListOptions"
                                :key="item.userId"
                                :label="item.nickname"
                                :value="item.userId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="类型" prop="type">
                        <el-cascader
                            v-model="postForm.type"
                            placeholder="请选择文章类型"
                            :options="articleTypeList"
                            :props="cascaderProps"
                        ></el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发布日期" prop="createTime">
                        <el-date-picker
                            v-model="postForm.createTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            :style="{ width: '100%' }"
                            placeholder="请选择发布日期"
                            clearable
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row type="flex" justify="start" align="middle" :gutter="15">
                <el-col :span="24">
                    <el-form-item label="头图" prop="banner">
                        <el-row class="flex justify-start">
                            <el-image
                                v-if="postForm.banner"
                                class="avatar margin-right"
                                :src="postForm.banner"
                                fit="cover"
                                :preview-src-list="[postForm.banner]"
                            ></el-image>
                            <el-upload
                                action="#"
                                :show-file-list="false"
                                :http-request="handelUpload"
                                class="avatar-uploader"
                                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                            >
                                <i
                                    class="el-icon-plus avatar-uploader-icon"
                                ></i>
                            </el-upload>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item
                label="正文"
                prop="content"
                style="margin-bottom: 30px"
            >
                <Tinymce
                    ref="editor"
                    v-model="postForm.content"
                    :height="400"
                />
            </el-form-item>

            <el-form-item
                ><div class="flex justify-end">
                    <el-button
                        v-if="isEdit"
                        type="warning"
                        icon="el-icon-document-checked"
                        :loading="loading"
                        @click="submitForm"
                        >保存修改</el-button
                    >
                    <el-button
                        v-if="!isEdit || this.postForm.status === 0"
                        type="primary"
                        icon="el-icon-upload2"
                        :loading="loading"
                        @click="handlePublish"
                        >马上发布</el-button
                    >
                    <el-button
                        v-if="!isEdit"
                        icon="el-icon-refresh"
                        type="success"
                        :loading="loading"
                        @click="handleDraft"
                        >存为草稿</el-button
                    >
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import MDinput from "@/components/MDinput";
import { getArticleById, saveArticle } from "@/api/article";
import { getArticleTypeList, getArticleTypeById } from "@/api/articletype";
import { getAllAdminList } from "@/api/admin";
import { upload } from "@/api/obs";

export default {
    name: "ArticleDetail",
    components: {
        Tinymce,
        MDinput,
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        const validateRequire = (rule, value, callback) => {
            var hint = rule.field == "content" ? "正文" : "";
            if (!value || value === "") {
                this.$message.warning("请填写必要项");
                callback(new Error("请输入" + hint));
            } else {
                callback();
            }
        };
        return {
            searchForm: {},
            postForm: {
                content: "",
                title: "",
                summary: "",
                type: "",
                createTime: "",
            },
            loading: false,
            authorListOptions: [],
            previreImageVisible: false,
            dialogImageUrl: "",
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "blur",
                    },
                ],
                summary: [
                    {
                        required: true,
                        message: "请输入摘要",
                        trigger: "blur",
                    },
                ],
                userId: [
                    {
                        required: true,
                        message: "请选择作者",
                        trigger: "change",
                    },
                ],
                createTime: [
                    {
                        required: true,
                        message: "请选择发布日期",
                        trigger: "change",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "请选择文章类型",
                        trigger: "change",
                    },
                ],
                content: [
                    {
                        required: true,
                        validator: validateRequire,
                        trigger: "blur",
                    },
                ],
            },
            tempRoute: {},

            articleTypeList: [],
            cascaderProps: {
                value: "id",
                label: "type",
                children: "children",
                expandTrigger: "hover",
            },
            articleType: [],
        };
    },
    created() {
        if (this.isEdit) {
            const id = this.$route.params && this.$route.params.id;
            this.fetchData(id);
        }
        this.getAllAdminList();
        this.getArticleTypeList();

        // Why need to make a copy of this.$route here?
        // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
        // https://github.com/PanJiaChen/vue-element-admin/issues/1221
        this.tempRoute = Object.assign({}, this.$route);
    },
    methods: {
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url;
            this.previreImageVisible = true;
        },
        handelUpload(param) {
            var formData = new FormData();
            // 添加参数
            formData.append("file", param.file);
            upload(formData)
                .then((res) => {
                    this.postForm.banner = res.data;
                    this.postForm = _.cloneDeep(this.postForm);
                    console.log(this.postForm);
                })
                .catch((err) => {});
        },
        fetchData(id) {
            getArticleById(id)
                .then((response) => {
                    this.postForm = response.data;
                    if (
                        this.postForm.type !== null &&
                        this.postForm.type !== ""
                    ) {
                        this.getArticleTypeById();
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        submitForm() {
            this.handleArticleTypeChange();
            this.$refs.postForm.validate((valid) => {
                if (valid) {
                    this.loading = true;

                    saveArticle(this.postForm).then((res) => {
                        if (res.success) {
                            this.$notify({
                                title: "操作成功",
                                message: "你的文章已经保存",
                                type: "success",
                                duration: 2000,
                            });
                            this.$router.push("/article/list");
                        }
                    });
                    this.loading = false;
                } else {
                    this.$message.warning("请填写必要的内容");
                    return false;
                }
            });
        },
        draftForm() {
            this.handleArticleTypeChange();
            if (
                this.postForm.content.length === 0 ||
                this.postForm.title.length === 0
            ) {
                this.$message.warning("请填写必要的标题与正文");
                return;
            }
            saveArticle(this.postForm).then((res) => {
                if (res.success) {
                    this.$message.success("草稿保存成功");
                }
            });
        },

        getAllAdminList() {
            getAllAdminList().then((res) => {
                this.authorListOptions = res.data;
            });
        },

        getArticleTypeList() {
            getArticleTypeList().then((res) => {
                this.articleTypeList = this.getTreeData(res.data);
            });
        },

        // 按id获取文章类型
        getArticleTypeById() {
            getArticleTypeById(this.postForm.type).then((res) => {
                var data = res.data;
                var array = [];
                if (data.parentId != 0) {
                    array.push(data.parentId);
                }
                array.push(data.id);
                this.articleType = array;
            });
        },

        handleArticleTypeChange() {
            if (this.postForm.type instanceof Array) {
                console.log(this.postForm);
                var type = this.postForm.type;
                this.postForm.type = type[type.length - 1];
            }
        },

        handlePublish() {
            this.postForm.status = 1;
            this.submitForm();
        },

        handleDraft() {
            this.postForm.status = 0;
            this.draftForm();
        },

        // 递归判断列表，把最后的children设为undefined
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
    },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

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
</style>
