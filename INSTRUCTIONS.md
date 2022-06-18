# Instructions

***Disclaimer:***
This scenario is ***based*** on a real Department of Defense (DoD) manual, however, please stick with the included instructions and don't fill in the blanks with any additional information you can find online.

## Intro

The US Department of Defense (DoD) issues an instruction manual titled, "Military Standard Requisitioning and Issue Procedures," or MILSTRIP for short.

This manual, among other things, defines a standard format for submitting requisition requests, including followups and cancellations for outstanding requisitions.  You may think of a requisition as a purchase order.

The purpose of the standardized MILSTRIP format is to allow disparate activities (or entities) across the entire DoD to have a standard way to source and reconcile material logistics needs.

## The ask

You are working for a government contractor seeking to build a modern application to assist logistics professionals across the DoD manage their procurement processes.

To achieve its requirements, the application being developed will ultimately need to generate and submit MILSTRIP requests.

You have been tasked with developing a MILSTRIP validator library, which will ultimately be used as a dependency in this application, and potentially others.

## Requirements

Before you get started, fork or otherwise publish a copy of this repo to your own GitHub or other SCM account to work in and ultimately share your completed solution.

### Functional

- The library shall expose an interface equivalent to the following (pre-scaffolded for you at `src/validator/validator.ts`):

  ```typescript
  interface IValidator {
    Validate(milstrip: string): string[];
  }
  ```

- Any positions not covered by specific requirements may be empty spaces or any other character.

- The error, "Invalid Length" shall be returned when the submitted MILSTRIP is less than or greater than 80 characters in length.

- The error, "Invalid Document Identifier" shall be returned when the the first three characters of a MILSTRIP (positions 1-3) do not conform to the following:
  - The position 1 character must be a "D"
  - The position 2 character must be alphanumeric
  - The position 3 character must be alphabetical or the character, "_"

- The error, "Invalid Routing Identifier" shall be returned when the characters in positions 4-6 of a submitted MILSTRIP do not conform to the following:
  - The position 4 character must be alphabetical
  - The position 5 and 6 characters must be alphanumeric

- The error, "Invalid Media and Status Code" shall be returned when the character at position 7 of a submitted MILSTRIP is not one of the following characters:
  - space character (i.e. ' ')
  - A, S, 0

- The error, "Invalid Federal Supply Class (FSC)" shall be returned when any of the characters at positions 8-11 of a submitted MILSTRIP are not numeric.

- The error, "Invalid National Item Identification Number (NIIN)" shall be returned when the characters at positions 12-22 of a submitted MILSTRIP do not conform to the following:
  - The characters at positions 12-14 are numeric
  - The position 15 character is a "-"
  - The characters at positions 16-18 are numeric
  - The position 19 character is a "-"
  - The characters at positions 20-22 are numeric

- The error, "Invalid Unit of Issue (U/I)" shall be returned when characters at positions 23 and 24 do not equal one of the following:
  - EA, BX, DZ, GP

- The error, "Invalid Quantity" shall be returned when characters at positions 25-29 are not numeric and between the range 00001-99999

- The error, "Invalid DoDAAC" shall be returned when characters at positions 30-35 are not alphanumeric

- The error, "Invalid Date" shall be returned when characters at positions 36-39 do not represent a Julian date:
  - The characters at positions 36-37 are numeric and accurately represent the current year (2022 would be "22")
  - The characters at positions 38-39 are numeric and between the range 1-366

- The error, "Invalid Serial" shall be returned when characters at positions 40-43 are not numeric and between the range 001-999

- The error, "Invalid Signal Code" shall be returned when the character at position 51 is not one of the following:
  - A, B, C, J, K, L

- The error, "Invalid Fund Code" shall be returned when the characters at positions 52-53 are not alphanumeric

- The error, "Invalid Priority Designator Code" shall be returned when the characters at positions 60-61 are not numeric and between the range 01-15

- All detected validation errors shall be returned so that clients can take further action.
  - i.e. The validator will not stop at the first error, but return all detectable errors.

### Non-functional

- All tests included in `src/validator/validator.spec.ts` must pass.  These serve as an oracle for meeting the above functional requirements.
  - It is acceptable to make small changes to these tests, so long as their intent is maintained.

- It is expected that individual validation requirements will change over time and that additional validations may be required. The validation library you produce must be extensible, and have a clear path for such extension.
  - Be prepared to articulate this path for extension.
