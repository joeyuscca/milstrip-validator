# Instructions

## Intro

The US Department of Defense (DoD) issues an instruction manual titled, "Military Standard Requisitioning and Issue Procedures," or MILSTRIP for short.

- ***You will find a copy of a decommissioned MILSTRIP manual in the /resources directory***

This manual, among other things, defines a standard format for submitting requisition requests, including followups and cancellations for outstanding requisitions.  You may think of a requisition as a purchase order.

The purpose of the standardized MILSTRIP format is to allow disparate activities (or entities) across the entire DoD to have a standard way to source and reconcile material logistics needs.

## The ask

You are working for a government contractor seeking to build a modern application to assist logistics professionals across the DoD manage procurement.

To achieve its requirements, the application being developed will ultimately need to generate and submit MILSTRIP requests.

You have been tasked with developing a MILSTRIP validator library, which will ultimately be used as dependency in this application, and potentially others.

## Library requirements

- The library shall expose an interface functionally equivalent to the following:

  ```typescript
  interface IValidator {
    Validate(milstrip: string): string[];
  }
  ```

- All detected validation errors shall be returned so that clients can take further action.
