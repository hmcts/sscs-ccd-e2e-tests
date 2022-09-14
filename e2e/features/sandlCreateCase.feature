@test1
Feature: S and L

  Scenario: Schedule and Listing Create Hearing

    Given I presetup an "SANDLPIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the taxCredit appeal with upload contains further information "No" option
    Then the case should be in "Response received" state

    When I switch to be a Case Officer
    And I navigate to an existing case
    When I choose "Response reviewed"
    And I choose Requires Interlocutory Review No "Response reviewed"
    And I submit "Response reviewed"
    Then the case should be in "Ready to list" state
    Given I navigate to an existing case
    And I click on Request Hearing link

  Scenario: Schedule and Listing Amend Hearing

    Given I presetup an "SANDLPIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the taxCredit appeal with upload contains further information "No" option
    Then the case should be in "Response received" state

    When I switch to be a Case Officer
    And I navigate to an existing case
    When I choose "Response reviewed"
    And I choose Requires Interlocutory Review No "Response reviewed"
    And I submit "Response reviewed"
    Then the case should be in "Ready to list" state
    Given I navigate to an existing case
    And I click on Amend Hearing link









