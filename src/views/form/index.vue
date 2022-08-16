<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="地点">
        <el-select v-model="form.region" placeholder="地点">
          <el-option label="广州" value="广州"></el-option>
          <el-option label="深圳" value="深圳"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="日期"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="11">
          <el-time-picker
            v-model="form.time"
            type="fixed-time"
            placeholder="时间"
            style="width: 100%"
          ></el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="置顶">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>

      <el-form-item label="类型">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="类型A" name="type"></el-checkbox>
          <el-checkbox label="类型B" name="type"></el-checkbox>
          <el-checkbox label="类型C" name="type"></el-checkbox>
          <el-checkbox label="类型D" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="赞助商"></el-radio>
          <el-radio label="场地"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="介绍">
        <el-input v-model="form.des" type="textarea"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button type="warning" @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date: "",
        time: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>