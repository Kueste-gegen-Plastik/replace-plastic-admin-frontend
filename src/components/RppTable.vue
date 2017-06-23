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

		<el-table v-if="listLoading || rppData.length > 0" :data="rppData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column 
				v-for="colprop in tableConfig.fields" 
				:prop="colprop.key" 
				:label="colprop.label"
				:min-width="['id'].indexOf(colprop.label.toLowerCase()) > -1 ? 100 : 250"
				:key="colprop.key"
				:sortable="colprop.sortable ? 'sortable' : false">
			</el-table-column>
			<el-table-column label="Aktionen" width="200" fixed="right">
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

					<!-- normal text fields -->
					<el-input v-if="!formItem.type || formItem.type === 'text'" :disabled="!formItem.editable" v-model="editForm[formItem.key]" auto-complete="off"></el-input>

					<!-- boolean fields -->
					<el-checkbox v-model="editForm[formItem.key]" v-if="formItem.type && formItem.type === 'boolean'"  :disabled="!formItem.editable" :label="formItem.label" name="type"></el-checkbox>
      					
					<!-- relations (autocomplete) -->
					<el-autocomplete v-if="formItem.type && formItem.type === 'autocomplete'"
					v-model="editForm[formItem.key]"
					:fetch-suggestions="querySearchAsync"
					placeholder="Suchen..."
					@select="handleSelect"
					></el-autocomplete>

					<!-- LONGTEXT -->
					<el-input  v-if="formItem.type && formItem.type === 'longtext'" type="textarea"  :disabled="!formItem.editable" v-model="editForm[formItem.key]"></el-input>

					<!--  ENUM -->
					<el-select v-if="formItem.type && formItem.type === 'enum'"  :disabled="!formItem.editable" v-model="editForm[formItem.key]" placeholder="Bitte auswählen...">
						<el-option v-for="optn in formItem.options" :key="optn" :label="optn" :value="optn"></el-option>
					</el-select>

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
					<!-- normal text fields -->
					<el-input v-if="!formItem.type || formItem.type === 'text'"  :disabled="!formItem.editable" v-model="addForm[formItem.key]" auto-complete="off"></el-input>

					<!-- boolean fields -->
					<el-checkbox v-if="formItem.type && formItem.type === 'boolean'"  :disabled="!formItem.editable" :label="formItem.label" name="type"></el-checkbox>
      					
					<!-- relations (autocomplete) -->
					<el-autocomplete v-if="formItem.type && formItem.type === 'autocomplete'"
					v-model="addForm[formItem.key]"
					:fetch-suggestions="querySearchAsync"
					:focus="setModel(formItem.model, formItem.modelsearchfield, formItem.modellabel, formItem.modelvalue)"
					:props="{ 'label' : formItem.modellabel, 'value' : formItem.modelvalue }"
					placeholder="Suchen..."
					@select="handleSelect"
					></el-autocomplete>

					<!-- LONGTEXT -->
					<el-input  v-if="formItem.type && formItem.type === 'longtext'"  :disabled="!formItem.editable" type="textarea" v-model="addForm[formItem.key]"></el-input>
					
					<!--  ENUM -->
					<el-select v-if="formItem.type && formItem.type === 'enum'"  :disabled="!formItem.editable" v-model="addForm[formItem.key]" placeholder="Bitte auswählen...">
						<el-option v-for="optn in formItem.options" :key="optn" :label="optn" :value="optn"></el-option>
					</el-select>
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

				autocompleteItems: [],
				autocompleteModel: '',
				autocompleteModelSearchfield: '',
				autocompleteModelLabel: '',
				autocompleteModelValue: '',

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
					$skip: 5 * (this.page-1),
					$limit: 25,
				};
				if(this.tableConfig.filter.value !== '') {
					para[this.tableConfig.filter.key] = this.tableConfig.filter.value;
				}
				this.listLoading = true;
				api[this.tableConfig.name + 'Api'].get(para).then((res) => {
					this.total = res.total;
					this.rppData = res.data;
					this.listLoading = false;
				});
			},
			handleDel(index, row) {
				this.$confirm('Wollen Sie wirklich löschen?', 'Löschen', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					api[this.tableConfig.name + 'Api'].delete(row.id).then((res) => {
						this.listLoading = false;
						this.$message({
							message: 'Gelöscht',
							type: 'success'
						});
						this.getData();
					});
				}).catch(() => {

				});
			},
			handleEdit (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			handleAdd () {
				this.addFormVisible = true;
				let initialConfig = {};
				this.tableConfig.fields.forEach(field => {
					initialConfig[field.key] = '';
				})
				this.addForm = initialConfig;
			},
			editSubmit () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('Wollen Sie wirklich speichern?', 'Speichern', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							api[this.tableConfig.name + 'Api'].update(para).then((res) => {
								this.editLoading = false;
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
			
			addSubmit () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('Wollen Sie wirklich speichern?', 'Speichern', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							api[this.tableConfig.name + 'Api'].create(para).then((res) => {
								this.addLoading = false;
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
			selsChange (sels) {
				this.sels = sels;
			},

			// ---- AUTOCOMPLETE
			setModel(model, searchfield, modelLabel, modelValue) {
				this.autocompleteModel = model;
				this.autocompleteModelSearchfield = searchfield;
				this.autocompleteModelLabel = modelLabel;
				this.autocompleteModelValue = modelValue;
			},
			querySearchAsync(queryString, cb) {
				let para = {
					$limit: 25,
				};
				var searchName = this.autocompleteModelSearchfield + '[$like]';
				para[searchName] = '%' + queryString + '%';
				api[this.autocompleteModel + 'Api'].get(para).then((res) => {
					cb(res.data.map(itm => {
						itm.value = itm[this.autocompleteModelValue];
						itm.label = itm[this.autocompleteModelLabel];
						return itm;
					}));
				});

			},
			handleSelect(item) {
				console.log(item);
			}
			
		},
		mounted() {
			this.getData();
		}
	}

</script>

<style scoped>

</style>