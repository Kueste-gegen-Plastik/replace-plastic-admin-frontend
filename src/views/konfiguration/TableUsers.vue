<template>
	<rpp-table :table-config="tableConfig"></rpp-table>
</template>

<script>

	import RppTable from '../../components/RppTable.vue';
/*

    id : {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    roles: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['admin', 'editor', 'reader', 'user']
    }
  }
    */
	export default {
		components: {
			RppTable
		},
		data() {
			return {
				tableConfig : {
					name : 'users', // name of the entity
					filter: {
						label : 'Nutzername',
						key: 'username',
						value: ''
					},
					// fields to be displayed & editable
					fields : [{ 
						key: 'username',
						label:  'Nutzername',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Nutzername ist ein Pflichtfeld',
						value: ''
					}, {
						key: 'email',
						label: 'E-Mail',
						editable: true,
						required: false, 
						sortable: true,
						list: true,
						message: '', 
						value: ''
					},{ 
						key: 'password',
						label: 'Passwort',
						editable: true,
						required: true, 
						sortable: true,
						list: true,
						message: 'Text ist ein Pflichtfeld', 
						value: ''
					},{ 
						key: 'name',
						label: 'Vorname',
						editable: true,
						required: false, 
						sortable: true,
						list: true,
						message: 'Text ist ein Pflichtfeld', 
						value: ''
					},{ 
						key: 'lastname',
						label: 'Nachname',
						editable: true,
						required: false, 
						sortable: true,
						list: true,
						message: 'Text ist ein Pflichtfeld', 
						value: ''
					},{ 
						key: 'roles',
						label: 'Nutzerrolle',
						editable: true,
						required: true, 
						sortable: false,
						list: true,
						type: 'enum',
						options: ['admin', 'editor', 'reader', 'user'],
						message: 'Text ist ein Pflichtfeld', 
						value: ''
					}]
				}
			}
		}
	}

</script>