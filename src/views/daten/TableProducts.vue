<template>
	<rpp-table :table-config="tableConfig"></rpp-table>
</template>

<script>
    /*
    MODEL : {
        id : {
            type: Sequelize.INTEGER(11),
            limit: 11,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: true
            },
                barcode: {
                type: Sequelize.STRING,
                allowNull: false
            },
                asin: {
            type: Sequelize.STRING(45)
            },
                name: {
            type: Sequelize.STRING
            },
                detailname:  {
            type: Sequelize.STRING
            },
                vendor:  {
            type: Sequelize.STRING
            },
                maincat: {
            type: Sequelize.STRING(45)
            },
                subcat: {
            type: Sequelize.STRING(45)
            },
            contents:  {
            type: Sequelize.STRING
            },
                pack: {
            type: Sequelize.INTEGER(11)
            },
                origin: {
            type: Sequelize.STRING(45)
            },
                descr:  {
            type: Sequelize.STRING
            },
                name_en: {
            type: Sequelize.STRING
            },
                detailname_en: {
            type: Sequelize.STRING
            },
                descr_en: {
            type: Sequelize.STRING
            },
                validated: {
            type: Sequelize.STRING(45)
            },
        }
    */
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
						label : 'Produktname',
						key: 'detailname',
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
						label: 'Generischer Produktname',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Generischer Produktname ist ein Pflichtfeld', 
						value: ''
					},{ 
						key: 'detailname',
						label: 'Detaillierter Produktname',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Detaillierter Produktname ist ein Pflichtfeld',
						value: ''
					},{
						key: 'vendor',
						label: 'Hersteller',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Hersteller ist ein Pflichtfeld',
						value: ''
                    },{
						key: 'maincat',
						label: 'Hauptkategorie',
						editable: true,
						required: true, 
						sortable: true,
						list: false,
						message: 'Hauptkategorie ist ein Pflichtfeld',
						value: ''
                    },{
						key: 'subcat',
						label: 'Unterkategorie',
						editable: true,
						required: true, 
						sortable: true,
						list: false,
						message: 'Unterkategorie ist ein Pflichtfeld',
						value: ''
                    },{
						key: 'contents',
						label: 'Inhaltsstoffe',
						editable: true,
						required: false, 
						sortable: true,
						list: false,
						message: '',
						value: ''
                    },{
						key: 'pack',
						label: 'Verpackung',
						editable: true,
						required: false, 
						sortable: true,
						list: false,
						message: '',
						value: ''
                    },{
						key: 'origin',
						label: 'Herkunftsland',
						editable: true,
						required: false, 
						sortable: true,
						list: false,
						message: '',
						value: ''
                    },{
						key: 'descr',
						label: 'Beschreibung',
						editable: true,
						required: false, 
						sortable: true,
						list: false,
						message: '',
						value: ''
                    }]
				}
			}
		}
	}

</script>