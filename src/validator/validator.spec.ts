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
    const documentIdentifier = 'Daa';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, documentIdentifier));
    expect(errors).not.toContain('Invalid Document Identifier');
  });

  it('should return errors including "Invalid Document Identifier" when given a milstrip with a document identifier that does not start with "D"', () => {
    const documentIdentifier = 'daa';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, documentIdentifier));
    expect(errors).toContain('Invalid Document Identifier');
  });

  it('should return errors including "Invalid Document Identifier" when given a milstrip with a document identifier with a non alphanumeric 2nd character', () => {
    const documentIdentifier = 'D.a';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, documentIdentifier));
    expect(errors).toContain('Invalid Document Identifier');
  });

  it('should return errors including "Invalid Document Identifier" when given a milstrip with a document identifier with a non alphanumeric 3rd character', () => {
    const documentIdentifier = 'Da.';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, documentIdentifier));
    expect(errors).toContain('Invalid Document Identifier');
  });

  it('should not return errors including "Invalid Document Identifier" when given a milstrip with a document identifier with a "_" as a 3rd character', () => {
    const documentIdentifier = 'Da_';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, documentIdentifier));
    expect(errors).not.toContain('Invalid Document Identifier');
  });

  it('should not return errors including "Invalid Routing Identifier" when given a milstrip with a valid routing identifier', () => {
    const routingIdentifier = 'a11';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, routingIdentifier));
    expect(errors).not.toContain('Invalid Routing Identifier');
  });

  it('should return errors including "Invalid Routing Identifier" when given a milstrip with a routing identifier starting with a number', () => {
    const routingIdentifier = '111';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, routingIdentifier));
    expect(errors).toContain('Invalid Routing Identifier');
  });

  it('should return errors including "Invalid Routing Identifier" when given a milstrip with a routing identifier with a symbol as the 2nd character', () => {
    const routingIdentifier = 'a.1';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, routingIdentifier));
    expect(errors).toContain('Invalid Routing Identifier');
  });

  it('should return errors including "Invalid Routing Identifier" when given a milstrip with a routing identifier with a symbol as the 3rd character', () => {
    const routingIdentifier = 'a1.';
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, routingIdentifier));
    expect(errors).toContain('Invalid Routing Identifier');
  });
});
