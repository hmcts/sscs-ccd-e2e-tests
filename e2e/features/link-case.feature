@migrated-to-exui @nightly-test-bug @EUI-4346-bug-ticket
Feature: Link a case

  Background:
    Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    Then the case should be in "With DWP" state

  Scenario: Link with another sscs case
    When I choose "Link a case"
    And I add a "1627639474273394" case to be linked
    Then I should see "1627639474273394" case linked within related cases tab