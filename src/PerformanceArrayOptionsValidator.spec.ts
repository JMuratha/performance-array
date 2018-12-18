/// <reference path="./PerformanceArrayOptionsValidator.ts" />
/// <reference path="./specImports.spec.ts" />

describe('PerformanceArrayOptionsValidator', () => {

  it('should allow and empty object', () => {
    const validator = new PerformanceArray.PerformanceArrayOptionsValidator({});
    validator.validate();
  });

  it('should throw an error on an unknown key', () => {
    let error: Error = null;

    try {
      const validator = new PerformanceArray.PerformanceArrayOptionsValidator(
        (<any>{ powderThatMakesYouSayYes: 'yes' })
      );
      validator.validate();
    } catch (e) {
      error = e;
    }

    expect(error).to.not.be.null;
  });

  it('should throw an error on an invalid index option key', () => {
    let error: Error = null;

    try {
      const validator = new PerformanceArray.PerformanceArrayOptionsValidator((<any>{
        indices: [{ powderThatMakesYouSayYes: 'yes' }]
      }));
      validator.validate();
    } catch (e) {
      error = e;
    }

    expect(error).to.not.be.null;
  });

  it('should throw an error on an invalid index property name', () => {
    let error: Error = null;

    try {
      const validator = new PerformanceArray.PerformanceArrayOptionsValidator((<any>{
        indices: [{
          propertyNames: [{}]
        }]
      }));
      validator.validate();
    } catch (e) {
      error = e;
    }

    expect(error).to.not.be.null;
  });

  it('should validate a fully configured options object', () => {
    const validator = new PerformanceArray.PerformanceArrayOptionsValidator({
      indices: [
        {
          propertyNames: ['id']
        }
      ]
    });
    validator.validate();
  });
});