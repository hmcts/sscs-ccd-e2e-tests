@lytest
Feature: S and L

  Scenario: Schedule and Listing

    Given I presetup an "SANDLPIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    Then the case should end in "With FTA" state

    #When I switch to be a DWPResponse Writer
    #And I navigate to an existing case
    #When I choose "Upload response"
    #When I click
    And I click on Request Hearing link








