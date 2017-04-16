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
					name : 'entries', // name of the entity
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
						key: 'barcode',
						label: 'Barcode/EAN',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Barcode ist ein pflichtfeld', 
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
						key: 'firstname',
						label: 'Vorname',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Vorname ist ein Pflichtfeld',
						value: ''
					},{ 
						key: 'email',
						label: 'E-Mail',
						editable: true,
						required: true, 
						sortable: false,
						list: true,
						message: 'E-Mail ist ein Pflichtfeld',
						value: ''
					},{ 
						key: 'zip',
						label: 'PLZ',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'PLZ ist ein Pflichtfeld',
						value: ''
					},{ 
						key: 'productId',
						label:  'Produkt',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Produkt ist ein Pflichtfeld',
						value: ''
					}]
				}
			}
		}
	}

</script>