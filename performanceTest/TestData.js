var TestData = {
  performanceArrayOptions: {
    indices: [
      {
        propertyNames: ['id']
      },
      {
        propertyNames: ['firstName', 'lastName']
      }
    ]
  },
  /**
   * 
   * @param {number} count
   * @returns {Array<TTestDataData>}
   */
  generateTestData: function(count) {
    var testData = [];
    var currentId = 1;

    for(var key = 0; key < count; key++) {
      testData.push({
        id: currentId++,
        firstName: this.generateRandomName(),
        lastName: this.generateRandomName()
      });
    }

    return testData;
  },
  generateRandomName: function() {
    var choices = 'abcdefghijklmnopqrstuvwxyz ';
    var name = '';

    for(var key = 0; key < 15; key++) {
      var index = Math.floor(Math.random() * choices.length);
      name += choices[index];
    }

    return name;
  }
};

/**
 * @typedef {Object} TTestDataData
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 */