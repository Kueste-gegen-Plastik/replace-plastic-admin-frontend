<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.email" placeholder="E-Mail-Adresse"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getEntries">Suchen</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">Hinzufügen</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-table :data="entries" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="id" width="60">
			</el-table-column>
			<el-table-column prop="email" label="E-Mail" width="120" sortable>
			</el-table-column>
			<el-table-column prop="firstname" label="Vorname" width="100"   sortable>
			</el-table-column>
			<el-table-column prop="name" label="Nachname" width="100" sortable>
			</el-table-column>
			<el-table-column prop="zip" label="PLZ" width="120" sortable>
			</el-table-column>
			<el-table-column prop="productId" label="Produkt" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="Aktionen" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">Editieren</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">Löschen</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="25" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<el-dialog title="Datensatz editieren" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="E-Mail" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Vorname" prop="firstname">
					<el-input v-model="editForm.firstname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="Nachname" prop="name">
					<el-input v-model="editForm.firstname" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="PLZ" prop="zip">
					<el-input v-model="editForm.zip" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Abbrechen</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Speichern</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'

	//import NProgress from 'nprogress'
	import api from '../../api';


	/*
		id : {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
		email: {
      type: Sequelize.STRING
    },
		name: {
      type: Sequelize.STRING
    },
		firstname: {
      type: Sequelize.STRING
    },
		zip: {
      type: Sequelize.STRING(6)
    },
		sent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
	*/

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				entries: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: 'Name ist ein Pflichtfeld', trigger: 'blur' }
					],
					firstname: [
						{ required: true, message: 'Vorname ist ein Pflichtfeld', trigger: 'blur' }
					],
					email: [
						{ required: true, message: 'E-Mail ist ein Pflichtfeld', trigger: 'blur' }
					],
					zip: [
						{ required: true, message: 'PLZ ist ein Pflichtfeld', trigger: 'blur' }
					]
				},
				
				editForm: {
					name: '',
					firstname: '',
					email: '',
					zip: ''
				},

				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: 'Name ist ein Pflichtfeld', trigger: 'blur' }
					],
					firstname: [
						{ required: true, message: 'Vorname ist ein Pflichtfeld', trigger: 'blur' }
					],
					email: [
						{ required: true, message: 'E-Mail ist ein Pflichtfeld', trigger: 'blur' }
					],
					zip: [
						{ required: true, message: 'PLZ ist ein Pflichtfeld', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					firstname: '',
					email: '',
					zip: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getEntries();
			},
			//获取用户列表
			getEntries() {
				let para = {
					$skip: 25 * this.page,
					email: this.filters.email
				};
				this.listLoading = true;
				//NProgress.start();
				api.getEntries(para).then((res) => {
					this.total = res.total;
					this.entries = res.data;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getEntries();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getEntries();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getEntries();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getEntries();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getEntries();
		}
	}

</script>

<style scoped>

</style>