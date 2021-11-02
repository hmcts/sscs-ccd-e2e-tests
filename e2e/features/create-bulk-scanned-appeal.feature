@migrated-to-exui
Feature: Create a bulk-scanned appeal

  Background:
    Given I am signed in as a Case Officer

  @dwp @nightly-test-wip
  Scenario: Should end up in "With DWP" state when ALL fields are present
    And I have a PIP bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

  @dwp @nightly-test-wip
  Scenario: Should end up in "With DWP" state when ALL fields are present
    And I have a ESA bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state

  @dwp @nightly-test-wip
  Scenario: Should end up in "With DWP" state when SSCS1PEU fields are present
    And I have a PIP bulk-scanned document with SSCSPE fields
    When I choose the next step "Create new case from exception"
    Then the case should be in "With DWP" state
