<!--
 * @Author: jiapeng.Zheng
 * @Date: 2018-12-04 09:43:05
 * @LastEditors  : jiapeng.Zheng
 * @LastEditTime : 2020-03-31 16:24:29
 * @Description: 设备类型-模板-面板（数据定义）
 -->
<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span
        style="font-weight:bold"
      >{{ activeNode.data.typeName }} / {{ $t('template') }} / {{ activeTpl.tempName }} / {{ $t('panel') }} /</span>
      <span>{{ $t('deviceDataDefine') }}</span>
    </div>
    <el-form class="form-group" :inline="true" v-if="activeTpl.id">
      <el-form-item>
        <el-input placeholder="输入数据标识" v-model="searchForm.dataKey">
          <template slot="prepend">数据标识</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="输入数据名称" v-model="searchForm.dataName">
          <template slot="prepend">数据名称</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleRefresh()">{{ $t('search') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="plus" @click="onAddClick()">{{ $t('add') }}</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" icon="plus" @click="onAddAllClick()">{{ $t('addAll') }}</el-button>
      </el-form-item>-->
    </el-form>
    <el-table :data="tableData" v-loading="loading" border @sort-change="sortChange">
      <el-table-column prop="dataKey" label="输入标识" min-width="100" width="100"></el-table-column>
      <el-table-column prop="outKey" label="输出标识" min-width="100" width="100"></el-table-column>
      <el-table-column prop="dataName" label="数据名称" min-width="200"></el-table-column>
      <el-table-column prop="dataType" label="数据类型" min-width="100" width="100">
        <template v-slot="scope">{{ dataTypeDic[scope.row.dataType] }}</template>
      </el-table-column>
      <el-table-column prop="autoControl" label="手自动" width="100">
        <template v-slot="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.autoControl">该数据定义自动模式下允许操作</p>
            <p v-else>该数据定义自动模式下不允许操作</p>
            <div slot="reference">{{ scope.row.autoControl }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位符号" min-width="100" width="100">
        <template v-slot="scope">{{ scope.row.unit | unitFilter }}</template>
      </el-table-column>
      <el-table-column prop="defaultValue" label="默认值" min-width="100" width="100"></el-table-column>
      <el-table-column prop="format" label="数据转换" min-width="100"></el-table-column>
      <el-table-column label="操作" min-width="150" width="150">
        <template v-slot="scope">
          <el-button @click="onEditClick(scope.row)" type="primary" size="small">{{ $t('edit') }}</el-button>
          <el-button @click="onDelClick(scope.row.id)" type="danger" size="small">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-operate">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNo"
        :page-sizes="pageSizes"
        :page-size="searchForm.pageSize"
        :total="pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>

    <el-dialog
      :visible="isDialogVisible"
      width="30%"
      @close="isDialogVisible = false"
      class="edit-dialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <span slot="title" class="el-dialog__title">
        【{{ activeTpl.tempName }}】
        <span>{{ isAdd ? $t('adds') : $t('edits') }}</span>数据定义
      </span>
      <el-form :model="fillForm" :rules="rules" ref="fillForm">
        <div class="form-group col-sm-11">
          <el-form-item label="输入标识" prop="dataKey">
            <el-input v-model="fillForm.dataKey"></el-input>
          </el-form-item>
          <el-form-item label="输出标识" prop="outKey">
            <el-input v-model="fillForm.outKey"></el-input>
          </el-form-item>
          <el-form-item label="数据名称" prop="dataName">
            <el-input v-model="fillForm.dataName"></el-input>
          </el-form-item>
          <el-form-item label="数据类型" prop="dataType">
            <el-select
              v-model="fillForm.dataType"
              placeholder="请选择数据类型"
              filterable
              clearable
              @change="onDataTypeChange(fillForm)"
            >
              <el-option
                v-for="(value, key) in dataTypeDic"
                :key="key"
                :label="value"
                :value="key"
                :disabled="dataTypeConfig[key].disabled"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手自动" prop="autoControl">
            <el-radio-group v-model="fillForm.autoControl">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
            <el-tooltip
              content="用于标识该数据定义受不受手自动的影响(true：自动模式下允许操作；false：自动模式下不允许操作)"
              placement="top"
            >
              <icon class="url-tips" name="help"></icon>
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="dataTypeConfig[fillForm.dataType].hasUnit" label="单位符号" prop="unit">
            <!-- <el-input v-model="fillForm.unit"></el-input> -->
            <el-cascader
              v-model="fillForm.unit"
              placeholder="单位符号"
              filterable
              :show-all-levels="false"
              :props="unitCascaderProps"
              :options="dataTypeUnitConfig"
              @change="
                val => {
                  onUnitChange(val, fillForm)
                }
              "
            ></el-cascader>
          </el-form-item>
          <el-form-item label="默认值" prop="defaultValue">
            <el-input v-model="fillForm.defaultValue"></el-input>
          </el-form-item>
          <el-form-item label="数据转换" prop="format">
            <el-input v-model="fillForm.format"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button type="cancel" @click="isDialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="onSureClick">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// import { $utils } from '@helper'
import { DATA_TYPE_DIC } from '@constants/dictionaries'
import { DATA_TYPE_BOOLEAN, DATA_TYPE_CONFIG, DATA_TYPE_UNIT_CONFIG } from '@constants/dataTypeConfig'
import { DEVICE_DATADEFINE_PANEL } from '@constants/panelConfig'
import { $utils } from '@helper'

let self

export default {
  name: 'data-define-tpl',

  props: {
    activeNode: {
      required: true
    },
    activeTpl: {
      required: true
    }
  },

  data() {
    return {
      loading: false,
      isDialogVisible: false,
      isAdd: true,
      dataTypeDic: DATA_TYPE_DIC,
      dataTypeConfig: DATA_TYPE_CONFIG,
      dataTypeUnitConfig: DATA_TYPE_UNIT_CONFIG,
      unitCascaderProps: {
        children: 'children',
        label: 'label',
        value: 'value'
      },
      fillForm: {
        autoControl: false,
        dataType: DATA_TYPE_BOOLEAN,
        dataKey: '',
        outKey: '',
        dataName: '',
        unit: ['-'],
        defaultValue: '',
        format: '',
        tempId: '',
        model: 1,
        category: ''
      },
      rules: {
        dataType: [
          {
            required: true,
            message: '请输入数据类型',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        dataKey: [
          {
            required: true,
            message: '请输入数据标识',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        dataName: [
          {
            required: true,
            message: '请输入数据名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 25,
            message: '长度在 2 到 25 个字符',
            trigger: 'blur'
          }
        ]
      },
      tableData: [],
      // pageNo: 1, // 当前第几页
      pageTotal: 0, // 总条数
      // pageSize: 10, // 每页显示个数
      pageSizes: [10, 20, 30], // 每页显示个数选择器的选项设置
      searchForm: {
        OrderBy: '',
        OrderType: '',
        PageSize: 10, // 每页显示个数
        PageNo: 1, // 当前第几页
        Search: '',
        Category: 0,
        tempId: ''
      }
    }
  },
  computed: {},

  watch: {
    'activeNode.data'(newVal) {
      this.searchForm.tempId = newVal.id
      this.fillForm.tempId = newVal.id
      this.handleRefresh()
    },
    activeTpl(newVal) {}
  },

  components: {},

  created() {
    self = this
    this.searchForm.pageSize = this.pageSizes[0]
  },

  filters: {
    unitFilter: function(value) {
      // let valueObj = $utils.isJsonString(value) ? JSON.parse(value) : [`${value}`]
      const valueArray = $utils.getCascaderObj(value, self.dataTypeUnitConfig, self.unitCascaderProps)
      const result = valueArray[valueArray.length - 1] ? valueArray[valueArray.length - 1].label : ''
      return result
    }
  },

  methods: {
    /* ----------------------------refresh---------------------------- */
    // 表单刷新
    handleRefresh() {
      this.tableData = []
      if (this.searchForm.tempId) {
        this.loading = true
        this.$apis.deviceType
          .getTemplateProfile(this.searchForm)
          .then(result => {
            const tableData = result.data
            tableData.forEach(item => {
              this.tableData.push({
                ...item,
                unit: $utils.isJsonString(item.unit) ? JSON.parse(item.unit) : [`${item.unit}`]
              })
            })

            this.pageTotal = result.DataCount
          })
          .catch(errMsg => {
            this.$message.error(errMsg)
            console.error(errMsg)
          })
          .fin(() => {
            self.loading = false
          })
      }
    },

    // 排序
    sortChange({ prop, order }) {
      if (!this.$_.isNull(order) && !this.$_.isNull(prop)) {
        this.searchForm.sortData = prop
        this.searchForm.sortType = order.replace('ending', '')
        this.handleRefresh()
      }
    },

    // 每页显示条目个数改变时
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.searchForm.pageSize = val
      this.handleRefresh()
    },
    // 页码改变时的事件
    handleCurrentChange(val) {
      this.searchForm.pageNo = val
      this.handleRefresh()
      // console.log(`当前页: ${val}`)
    },

    onDataTypeChange(rowData) {
      const { dataType } = rowData
      if (dataType) {
        const { componentDataValue, hasUnit } = this.dataTypeConfig[dataType]
        rowData['unit'] = hasUnit ? rowData['unit'] : ['-']
        rowData['format'] = componentDataValue || ''
      }
    },

    onUnitChange(val, rowData) {
      const valArray = $utils.getCascaderObj(val, this.dataTypeUnitConfig, this.unitCascaderProps)
      rowData['format'] = JSON.stringify(valArray[valArray.length - 1].format)
    },

    // （新增/编辑）确认事件
    onSureClick() {
      const data = JSON.parse(JSON.stringify(this.fillForm))
      data.unit = JSON.stringify(data.unit)

      this.$refs.fillForm.validate(valid => {
        if (!valid) return
        const postData = {
          tempId: data.typeId,
          Id: data.id,
          DataName: data.dataName,
          Unit: data.unit,
          DataType: data.dataType,
          DefaultValue: data.defaultValue,
          Format: data.format,
          AutoControl: data.autoControl,
          OutKey: data.outKey,
          Model: data.model,
          Category: data.category
        }
        if (this.isAdd) {
          // 新增
          this.$apis.deviceType
            .addTemplateProfile(postData)
            .then(result => {
              this.$message.success(result.message)
              this.isDialogVisible = false
              this.handleRefresh()
            })
            .catch(errMsg => {
              this.$message.error(errMsg)
              console.error(errMsg)
            })
        } else {
          // 编辑
          this.$apis.deviceType
            .modifyTemplateProfile(postData)
            .then(result => {
              this.$message.success(result.message)
              this.isDialogVisible = false
              this.handleRefresh()
            })
            .catch(errMsg => {
              this.$message.error(errMsg)
              console.error(errMsg)
            })
        }
      })
    },
    // 新增
    onAddClick() {
      this.isAdd = true
      this.isDialogVisible = true
      this.fillForm.autoControl = false
      this.fillForm.dataType = DATA_TYPE_BOOLEAN
      this.fillForm.dataKey = ''
      this.fillForm.outKey = ''
      this.fillForm.dataName = ''
      this.fillForm.unit = ['-']
      this.fillForm.defaultValue = ''
      this.fillForm.format = ''
    },
    // async onAddAllClick() {
    //   let bs15pub = await $ajax.get('/public/testData/贝斯MC4系列PLC气泵版-ALL-191012.xlsx.json')
    //   let sta = {}
    //   ;(async () => {
    //     for (let i in bs15pub) {
    //       let data = bs15pub[i]
    //       try {
    //         await this.$apis.deviceType.addTemplateProfile(data)
    //         console.log(`add bs15pub ${i}`, data.dataKey, 'success')
    //       } catch (error) {
    //         console.error(`add bs15pub ${i}`, data.dataKey, 'error:', error)
    //       }
    //     }
    //   })()
    // },
    // 编辑
    onEditClick(rowData) {
      this.isAdd = false
      this.isDialogVisible = true
      this.fillForm = JSON.parse(JSON.stringify(rowData))
    },
    // 删除
    onDelClick(profileId) {
      this.$confirm('是否删除该记录？', '提示', { cancelButtonClass: 'el-button--cancel', closeOnClickModal: false })
        .then(() => {
          this.$apis.deviceType
            .removeTemplateProfile(this.fillForm.tempId, profileId)
            .then(result => {
              this.$message.success(result.message)
              this.handleRefresh()
            })
            .catch(errMsg => {
              this.$message.error(errMsg)
              console.error(errMsg)
            })
        })
        .catch(() => {
          this.$message.success('取消删除')
        })
    }
  }
}
</script>
<style lang="scss"></style>
