Feature: The Update Other Party Data

@update-other-party-data @migrated-to-exui @nightly-test
  Scenario: Update Other Party Data
    Given I presetup an "Child Support" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should end in "With DWP" state

    And I choose "Update other party data"
    And I add other party data



