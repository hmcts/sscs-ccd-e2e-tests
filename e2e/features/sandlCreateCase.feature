Feature: Schedule and Listing


  Scenario: Manually request a Hearing for PIP case

    Given I presetup an "SANDLPIP" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the appeal with upload contains further information "Yes" option and "ML" issue code
    Then the case should be in "Response received" state

    And I click on Request Hearing link

@test1
Scenario: Auto request a Hearing for PIP case

    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the appeal with upload contains further information "No" option and "EI" issue code
    Then the case should be in "Ready to list" state

    And I should see a hearing request generated for the appeal
    When I click on hearing details
    Then the venue of the hearing should be in "CARDIFF SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL"
    And the duration of the hearing should be "1 hour(s) and 30 minute(s)"
    And the earliest hearing date should be from "28" days of hearing requested

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









