<template>
	<rpp-table :table-config="tableConfig"></rpp-table>
</template>

<script>

	import RppTable from '../../components/RppTable.vue';
/*
	id : {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
		sent: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    },
    text: {
      type: Sequelize.STRING
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
    */
	export default {
		components: {
			RppTable
		},
		data() {
			return {
				tableConfig : {
					name : 'mails', // name of the entity
					filter: {
						label : 'E-Mail-Adresse',
						key: 'email',
						value: ''
					},
					// fields to be displayed & editable
					fields : [{ 
						key: 'id',
						label:  'ID',
						editable: false,
						required: true, 
						sortable: true,
						list: true,
						message: 'ID ist ein Pflichtfeld',
						value: ''
					}, { 
						key: 'productId',
						label:  'Produkt',
						editable: true,
						required: true, 
						sortable: true,
						type: 'autocomplete',
						model: 'product',
						modelsearchfield: 'detailname',
						modellabel: 'detailname',
						modelvalue: 'id',
						list: true,
						message: 'Produkt ist ein Pflichtfeld',
						value: ''
					},{ 
						key: 'vendorId',
						label:  'Hersteller-Kontakt',
						editable: true,
						required: true, 
						sortable: true,
						type: 'autocomplete',
						model: 'vendor',
						modelsearchfield: 'vendorname',
						modellabel: 'vendorname',
						modelvalue: 'id',
						list: true,
						message: 'Hersteller-Kontakt ist ein Pflichtfeld',
						value: ''
					}, {
						key: 'sent',
						label: 'Versendet?',
						editable: true,
						required: false, 
						sortable: true,
						list: true,
						type: 'boolean',
						message: '', 
						value: ''
					},{ 
						key: 'text',
						label: 'Text',
						editable: true,
						required: true, 
						sortable: true,
						type: 'longtext',
						list: true,
						message: 'Text ist ein Pflichtfeld', 
						value: ''
					}]
				}
			}
		}
	}

</script>