@migrated-to-exui
Feature: Withdrawal

  Background:
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should be in "With FTA" state

  @withdrawal @crossbrowser99 @nightly-test
  Scenario: Should end up in "With FTA" state when ALL fields are present
    When I choose "Admin Appeal Withdrawn"
    And I click submit withdrawal "Admin Appeal Withdrawn"
    And I submit "Admin Appeal Withdrawn"
    Then the case should be in "Dormant" state
