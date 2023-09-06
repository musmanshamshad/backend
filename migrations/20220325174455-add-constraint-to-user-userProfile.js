'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.addConstraint('userProfiles', ['userId'],{

      type:"FOREIGN KEY",
      name:"FK_user_userProfile",
      references:{
        table:"users",
        field:"id"
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
     });
     
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.removeConstraint('userProfiles','FK_user_userProfile')
     
  }
};
