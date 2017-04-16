<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="tableConfig.filter.value" :placeholder="tableConfig.filter.label"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getData">Suchen</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">Hinzufügen</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-table :data="rppData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column 
				v-for="colprop in tableConfig.fields" 
				:prop="colprop.key" 
				:label="colprop.label"
				:key="colprop.key"
				:sortable="colprop.sortable ? 'sortable' : false"
				width="120">
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="25" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<el-dialog title="Datensatz editieren" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item v-for="formItem in tableConfig.fields" :label="formItem.label" :prop="formItem.key" :key="formItem.key">
					<el-input v-model="editForm[formItem.key]" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">Abbrechen</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">Speichern</el-button>
			</div>
		</el-dialog>

		<el-dialog title="Datensatz anlegen" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item v-for="formItem in tableConfig.fields" :label="formItem.label" :prop="formItem.key" :key="formItem.key">
					<el-input v-model="addForm[formItem.key]" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">Abbrechen</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">Speichern</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	//import NProgress from 'nprogress'
	import * as api from '../api';

	export default {
		name: 'rpp-table',
		props : ['tableConfig'],
		data() {
			return {

				filters: {},
				rppData: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [], 

				editFormVisible: false,
				editLoading: false,

				editFormRules: { },
				editForm: {},

				addFormVisible: false,
				addLoading: false,

				addFormRules: {},
				addForm: {}

			}
		},
		methods: {
			// add validation rules from config object
			setTableRules() {

				this.editFormRules = this.addFormRules = {}
				this.tableConfig.fields.forEach(field => {
					let currentRule = {
						required : field.required,
						message: field.message,
						trigger : 'blur'
					}
					this.editFormRules[field.key] = currentRule;
					this.addFormRules[field.key] = currentRule;
					this.addForm[field.key] = '';
				});

			},
			handleCurrentChange(val) {
				this.page = val;
				this.getData();
			},
			getData() {
				let para = {
					$skip: 25 * this.page,
					email: this.filters.email
				};
				this.listLoading = true;
				api[this.tableConfig.name + 'Api'].get(para).then((res) => {
					this.total = res.total;
					this.entries = res.data;
					this.listLoading = false;
				});
			},
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					api[this.tableConfig.name + 'Api'].delete(row.id).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getData();
					});
				}).catch(() => {

				});
			},
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			handleAdd: function () {
				this.addFormVisible = true;
				let initialConfig = {};
				this.tableConfig.fields.forEach(field => {
					initialConfig[field.key] = '';
				})
				this.addForm = initialConfig;
			},
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('Wollen Sie wirklich speichern?', 'Speichern', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							api[this.tableConfig.name + 'Api'].update(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Speichern erfolgreich.',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getData();
							});
						});
					}
				});
			},
			
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('Wollen Sie wirklich speichern?', 'Speichern', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							api[this.tableConfig.name + 'Api'].create(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: 'Hinzufügen erfolgreich.',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getData();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			}
			
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>