export interface IValidator {
  Validate(milstrip: string): string[];
}

export class Validator implements IValidator {
  Validate(_milstrip: string): string[] {
    return [];
  }
}
