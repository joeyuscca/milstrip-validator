import { IValidator, Validator } from './validator';

describe('Validator', () => {
  let classUnderTest: IValidator;
  const generateMilstripWithContentAtIndex = (index: number, content: string) => {
    return `${'_'.repeat(index)}${content}${'_'.repeat(80 - (index + content.length))}`;
  };

  beforeEach(() => {
    classUnderTest = new Validator();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should not return errors including "Invalid Length" when given a milstrip that is 80 characters', () => {
    const errors = classUnderTest.Validate('_'.repeat(80));
    expect(errors).not.toContain('Invalid Length');
  });

  it('should return errors including "Invalid Length" when given a milstrip less than 80 characters', () => {
    const errors = classUnderTest.Validate('_'.repeat(79));
    expect(errors).toContain('Invalid Length');
  });

  it('should return errors including "Invalid Length" when given a milstrip more than 80 characters', () => {
    const errors = classUnderTest.Validate('_'.repeat(81));
    expect(errors).toContain('Invalid Length');
  });

  it('should not return errors including "Invalid Document Identifier" when given a milstrip with a valid document identifier', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, 'Daa'));
    expect(errors).not.toContain('Invalid Document Identifier');
  });

  it('should return errors including "Invalid Document Identifier" when given a milstrip with a document identifier that does not start with "D"', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, 'daa'));
    expect(errors).toContain('Invalid Document Identifier');
  });

  it('should return errors including "Invalid Document Identifier" when given a milstrip with a document identifier with a non alphanumeric 2nd or 3rd character', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, 'D.a'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(0, 'Da.')));
    expect(errors.filter(e => e === 'Invalid Document Identifier').length).toEqual(2);
  });

  it('should not return errors including "Invalid Document Identifier" when given a milstrip with a document identifier with a "_" as a 3rd character', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, 'Da_'));
    expect(errors).not.toContain('Invalid Document Identifier');
  });

  it('should not return errors including "Invalid Routing Identifier" when given a milstrip with a valid routing identifier', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, 'a11'));
    expect(errors).not.toContain('Invalid Routing Identifier');
  });

  it('should return errors including "Invalid Routing Identifier" when given a milstrip with a routing identifier starting with a number', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, '111'));
    expect(errors).toContain('Invalid Routing Identifier');
  });

  it('should return errors including "Invalid Routing Identifier" when given a milstrip with a routing identifier with a symbol as the 2nd or 3rd character', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, 'a.1'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(3, 'a1.')));
    expect(errors.filter(e => e === 'Invalid Routing Identifier').length).toEqual(2);
  });

  it('should not return errors including "Invalid Media and Status Code" when given a milstrip with a media and status code of A, S, 0, or empty space " "', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(6, 'A'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(6, 'S')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(6, '0')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(6, ' ')));
    expect(errors).not.toContain('Invalid Media and Status Code');
  });

  it('should return errors including "Invalid Media and Status Code" when given a milstrip with a media and status code not like: A, S, 0, or empty space " "', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(6, 'B'));
    expect(errors).toContain('Invalid Media and Status Code');
  });

  it('should not return errors including "Invalid Federal Supply Class (FSC)" when given a milstrip with a valid federal supply class', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '1234'));
    expect(errors).not.toContain('Invalid Federal Supply Class (FSC)');
  });

  it('should return errors including "Invalid Federal Supply Class (FSC)" when given a milstrip with a federal supply class consisting of non-numeric characters', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(7, 'a234'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '1a34')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '12a4')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '123a')));
    expect(errors.filter(e => e === 'Invalid Federal Supply Class (FSC)').length).toEqual(4);
  });
});
