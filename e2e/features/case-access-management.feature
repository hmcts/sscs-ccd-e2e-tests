 @nightly-test
Feature: Case Access Management

  Scenario: SSCS1 benefit - check RPC and case management location on the appearl details page
   Given I presetup an "PIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state
    And "Summary" tab should contain "Manchester" value for case management "Processing venue" field
    And "Appeal Details" tab should contain "LIVERPOOL" value for case management "Regional Processing Center Name" field
    And "Appeal Details" tab should contain "5" value for case management "Region" field
    And "Appeal Details" tab should contain "701411" value for case management "Base Location" field