@panel-composition @nightly-test
Feature: Panel composition

  Background:
    Given I presetup an "Tax Credit" SYA case
    When I switch to be a Case Officer
    And I navigate to an existing case

  Scenario: Judicial user accepts panel member
    Then the case should be in "With FTA" state
    When I choose "Upload response"
    And I respond to the taxCredit appeal with upload contains further information "Yes" option and "CE" issue code
    Then the case should be in "Response received" state

    When I choose "Confirm panel composition"
    And I select "Yes" to include a financial panel member for hearing
    Then the case should be in "Response received" state

    When I switch to be a Judge
    And I navigate to an existing case
    And "Appeal Details" tab should contain "Yes" value for "Case requires a Financially Qualified Panel Member (FQPM)" field
    And "Listing Requirements" tab should contain "Yes" value for "Case requires a Financially Qualified Panel Member (FQPM)" field