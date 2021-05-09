<template>
  <div class="app-container">
    <page-table
      ref="dataTable"
      row-key="id"
      :border="true"
      @load-table-data="loadTableData"
      @selection-change="selection"
    >
      <template slot="tb-columns">
        <el-table-column
          align="center"
          prop="avatarUrl"
          label="头像"
        >
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
        <el-table-column
        label="操作"
        align="center"
        width="200px"
      >
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
            @click="handleDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      </template>
    </page-table>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import pageTable from "@/components/PageTable/PageTable.vue";

export default {
  components: { pageTable },
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
      list: null,
      listLoading: true,
      searchForm: {},
    };
  },
  created() {
    // this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },

    loadTableData(filter, callback) {
      filter = {
        ...filter,
        ...this.searchForm,
      };

      getList(filter).then((res) => {
        this.total = res.data.total;
        let tableData = {
          ...res.data,
          data: res.data.records,
        };
        callback(tableData);
      });
    },

    selection(val) {
      console.log(val);
    },

    handleEdit(row) {
      console.log('row: ', row)
    }
  },
};
</script>
