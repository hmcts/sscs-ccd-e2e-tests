@test1
Feature: S and L

  Scenario: Schedule and Listing

    Given I presetup an "SANDLPIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the taxCredit appeal with upload contains further information "No" option
    Then the case should end in "Ready to list" state
    Given I navigate to an existing case
    Then the case should end in "With FTA" state

    #When I switch to be a DWPResponse Writer
    #And I navigate to an existing case
    #When I choose "Upload response"
    #When I click
    And I click on Request Hearing link








