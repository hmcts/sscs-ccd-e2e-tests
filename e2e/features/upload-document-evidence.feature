@migrated-to-exui-1 @nightly-test-wip
Feature: Create bundle for a case

  @bundle @nightly-test
  Scenario: Verify create bundle event for cases
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case