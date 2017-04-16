<template>
	<rpp-table :table-config="tableConfig"></rpp-table>
</template>

<script>

	import RppTable from '../../components/RppTable.vue';
	
	export default {
		components: {
			RppTable
		},
		data() {
			return {
				tableConfig : {
					name : 'vendors', // name of the entity
					filter: {
						label : 'E-Mail-Adresse',
						key: 'email',
						value: ''
					},
					// fields to be displayed & editable
					fields : [{
						key: 'id',
						label: 'ID',
						editable: false,
						required: true, 
						sortable: true,
						list: true,
						message: 'ID ist ein pflichtfeld', 
						value: ''
					},{ 
						key: 'name',
						label: 'Nachname',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Name ist ein Pflichtfeld', 
						value: ''
					},{ 
						key: 'email',
						label: 'E-Mail',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'E-Mail ist ein Pflichtfeld', 
						value: ''
					},{ 
						key: 'description',
						label: 'Beschreibung',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Beschreibung ist ein Pflichtfeld',
						value: ''
					}]
				}
			}
		}
	}

</script>