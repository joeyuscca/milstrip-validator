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

  it('should return exactly one of every error when given a completely invalid milstrip', () => {
    const expectedErrors = [
      'Invalid Length',
      'Invalid Document Identifier',
      'Invalid Routing Identifier',
      'Invalid Media and Status Code',
      'Invalid Federal Supply Class (FSC)',
      'Invalid National Item Identification Number (NIIN)',
      'Invalid Unit of Issue (U/I)',
      'Invalid Quantity',
      'Invalid DoDAAC',
      // 'Invalid Date',
      // 'Invalid Serial',
      // 'Invalid Signal Code',
      // 'Invalid Fund Code',
      // 'Invalid Priority Designator Code',
    ];
    const actualErrors = classUnderTest.Validate(generateMilstripWithContentAtIndex(0, '') + '_');
    expect(expectedErrors.every(e => actualErrors.includes(e))).toBeTruthy();
    expect(expectedErrors.length).toEqual(actualErrors.length);
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
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(3, 'a.a'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(3, 'aa.')));
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
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(7, 'a111'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '1a11')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '11a1')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(7, '111a')));
    expect(errors.filter(e => e === 'Invalid Federal Supply Class (FSC)').length).toEqual(4);
  });

  it('should not return errors including "Invalid National Item Identification Number (NIIN)" when given a milstrip with a valid NIIN', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-111-111'));
    expect(errors).not.toContain('Invalid National Item Identification Number (NIIN)');
  });

  it('should return errors including "Invalid National Item Identification Number (NIIN)" when given a milstrip with a non numeric NIIN', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(11, 'a11-111-111'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '1a1-111-111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '11a-111-111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-a11-111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-1a1-111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-11a-111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-111-a11')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-111-1a1')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-111-11a')));
    expect(errors.filter(e => e === 'Invalid National Item Identification Number (NIIN)').length).toEqual(9);
  });

  it('should return errors including "Invalid National Item Identification Number (NIIN)" when given a milstrip with NIIN without valid "-" separators', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111_111-111'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(11, '111-111_111')));
    expect(errors.filter(e => e === 'Invalid National Item Identification Number (NIIN)').length).toEqual(2);
  });

  it('should not return errors including "Invalid Unit of Issue (U/I)" when given a milstrip with a valid unit of issue', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(22, 'EA'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(22, 'BX')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(22, 'DZ')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(22, 'GP')));
    expect(errors).not.toContain('Invalid Unit of Issue (U/I)');
  });

  it('should return errors including "Invalid Unit of Issue (U/I)" when given a milstrip with an invalid unit of issue', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(22, 'FK'));
    expect(errors).toContain('Invalid Unit of Issue (U/I)');
  });

  it('should not return errors including "Invalid Quantity" when given a milstrip with a valid quantity', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '00001'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '99999')));
    expect(errors).not.toContain('Invalid Quantity');
  });

  it('should return errors including "Invalid Quantity" when given a milstrip with a non numeric quantity', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(24, 'a1111'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '1a111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '11a11')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '111a1')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '1111a')));
    expect(errors.filter(e => e === 'Invalid Quantity').length).toEqual(5);
  });

  it('should return errors including "Invalid Quantity" when given a milstrip with a quantity of 0', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(24, '00000'));
    expect(errors).toContain('Invalid Quantity');
  });

  it('should not return errors including "Invalid DoDAAC" when given a milstrip with a valid DoDAAC', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(29, '111111'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(29, 'aaaaaa')));
    expect(errors).not.toContain('Invalid DoDAAC');
  });

  it('should return errors including "Invalid DoDAAC" when given a milstrip with a DoDAAC containing symbols', () => {
    const errors = classUnderTest.Validate(generateMilstripWithContentAtIndex(29, '.aaaaa'))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(29, 'a.1111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(29, '1a.111')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(29, '11a.11')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(29, '111a.1')))
      .concat(classUnderTest.Validate(generateMilstripWithContentAtIndex(29, '1111a.')));
    expect(errors.filter(e => e === 'Invalid DoDAAC').length).toEqual(6);
  });
});
