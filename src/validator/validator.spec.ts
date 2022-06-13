import { IValidator, Validator } from './validator';

describe('Validator', () => {
  let classUnderTest: IValidator;

  beforeEach(() => {
    classUnderTest = new Validator();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
