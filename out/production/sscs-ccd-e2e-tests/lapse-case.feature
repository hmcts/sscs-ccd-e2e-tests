@migrated-to-exui @nightly-test
Feature: The lapse

  Background:
  Given I presetup an "PIP" SYA case
  And I am signed in as a Case Officer
  And I navigate to an existing case

  @lapse
  Scenario: Should end up in "With FTA" state when ALL fields are present
    When I choose "Lapse appeal"
    And I set FTA State to Lapsed "Lapse appeal"
    And I submit "Lapse appeal"
    Then the case should end in "With FTA" state

    When I choose "Confirm lapsed"
    And I submit "Confirm lapsed"
    Then the case should end in "Dormant" state

  @crossbrowser
  Scenario: Should end up in "With FTA" state when ALL fields are present
    When I choose "Lapse appeal"
    And I set FTA State to Lapsed "Lapse appeal"
    Then I submit "Lapse appeal"