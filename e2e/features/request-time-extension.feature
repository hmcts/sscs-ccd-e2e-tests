@request-time-extension @nightly-test @migrated-to-exui
Feature: The Request time extension functionality

  Background:
    Given I preset up a test case
    And I am signed in as a Case Officer
    And I navigate to an existing case

  @crossbrowser
  Scenario: Request time extension
    And I choose "Admin - send to With DWP"
    Given I complete the event
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    When I choose "Request time extension"
    And I upload a doc
    Then I see field "Event" with value "Request time extension" in "History" tab
