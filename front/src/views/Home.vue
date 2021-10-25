<template lang="pug">
//- 查询form
el-form(:inline="true" :model="queryForm" size="small" label-position="left")
  el-form-item
    el-button(type="primary" @click="operate")
      | 新增
  el-form-item(label="商品编号")
    el-input(v-model="queryForm._id")
  el-form-item(label="商品名")
    el-input(v-model="queryForm.goodName")
  el-form-item(label="数量")
    el-input(v-model="queryForm.count")
  el-form-item(label="详情")
    el-input(v-model="queryForm.des")
  el-form-item
    el-button(type="primary" @click="query")
      | 查询

//- 列表
el-table(:data="list" center size="mini")
  el-table-column(prop="goodName" label="商品名")
  el-table-column(prop="count" label="数量")
  el-table-column(prop="des" label="详情")
  el-table-column(label="操作")
    template(#default="props")
      el-button(type="primary" size="small" @click="operate(props.row)")
        | 编辑
      el-button(type="danger" size="small" @click="operate(props.row, true)")
        | 删除

//- 新增、编辑
el-drawer(v-model="detailShow" :title="editShow === true ? '编辑' : '新增'" direction="rtl")
  el-form(:model="detailForm" size="small" label-width="80px" label-position="left")
    //- el-form-item(label="商品编号" required v-if="false")
    el-form-item(label="商品编号" required v-if="log(editShow)")
      el-input(v-model="detailForm._id" readonly)
    el-form-item(label="商品名" required) 
      el-input(v-model="detailForm.goodName")
    el-form-item(label="数量")
      el-input(v-model="detailForm.count")
    el-form-item(label="详情")
      el-input(v-model="detailForm.des")
    el-form-item
      el-button(type="primary" size="small" @click="submit")
        | 确定
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
import { IGoodInfo, IList } from '@/types/goods'
import http from '@/http'

export default defineComponent({
  name: 'Home',
  setup() {
    /* 
    const list = reactive<IGoodList[]>([])
    list.push(...[{ id: 'id_123456', goodName: '手机', count: 26 }, { id: 'id_123457', goodName: '平板', count: 45 },]) 
    */
    const list = ref<IGoodInfo[]>([])

    const queryForm = ref({ goodName: '', count: '', _id: '', des: '' })
    const detailForm = ref({ goodName: '', count: '', _id: '', des: '' })
    const detailShow = ref(false)
    const editShow = ref(false)

    query()


    async function query() {
      const { data } = await http.get<IList>('/goods/list', queryForm.value)
      list.value = data.list
    }

    async function operate(form?: IGoodInfo, flag?: true) {
      if (!form) {
        detailShow.value = true
        editShow.value = false
        detailForm.value = { goodName: '', count: '', _id: '', des: '' }
      } else if (!flag) {
        detailShow.value = true
        editShow.value = true
        detailForm.value = { ...form }
      } else {
        await http.delete('/goods/delete', { _id: form._id })
        query()
      }
    }

    async function submit() {
      if (detailForm.value._id) {
        await http.put('/goods/edit', detailForm.value)
      }else{
        await http.put('/goods/edit', detailForm.value)
      }
      

      detailShow.value = false
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
      query()
    }


    function log(params:any) {
     console.log(params);
     return params
    }

    return {
      detailShow,
      editShow,
      list,
      queryForm,
      detailForm,
      query,
      operate,
      submit,
      log
    }
  }
});
</script>
