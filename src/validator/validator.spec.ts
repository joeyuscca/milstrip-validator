import { IClassName, ClassName } from './validator';

describe('ClassName', () => {
  let classUnderTest: IClassName;

  beforeEach(() => {
    classUnderTest = new ClassName();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
