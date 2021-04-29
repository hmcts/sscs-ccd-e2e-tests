@migrated-to-exui
Feature: The lapse

  Background:
  Given I presetup an "PIP" SYA case
  And I am signed in as a Case Officer
  And I navigate to an existing case
  Then the case should be in "With DWP" state

  @lapse @nightly-test @crossbrowser
  Scenario: Should end up in "With DWP" state when ALL fields are present
    When I choose "Lapse appeal"
    And I set DWP State to Lapsed "Lapse appeal"
    And I submit "Lapse appeal"
    Then the case should end in "With DWP" state

    When I choose "Confirm lapsed"
    And I submit "Confirm lapsed"
    Then the case should end in "Dormant" state
