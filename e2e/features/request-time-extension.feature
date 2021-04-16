@request-time-extension @nightly-test @migrated-to-exui
Feature: The Request time extension functionality

  Scenario: Request time extension
    Given I preset up a test case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And I choose "Admin - send to With DWP"
    Given I complete the event
    Then the case should be in "With DWP" state

    When I switch to be a DWPResponse Writer
    When I choose "Request time extension"
    And The page is accessible
    And I upload a doc
    Then I see field "Event" with value "Request time extension" in "History" tab



