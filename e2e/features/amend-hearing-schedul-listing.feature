@test1
Feature: Auto Amend & Manual Amend Hearing - Schedule and Listing

  Scenario 1: Manual amend Hearing for PIP case
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

    When I update the length of hearing to "2" hours
    Then the hearing status should be updated to "UPDATE REQUESTED"

  Scenario 2: Auto amend Hearing for PIP case
    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    Given I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the appeal with upload contains further information "No" option and "EI" issue code
    Then the case should be in "Ready to list" state

    When I choose "Update Listing Requirements"
    And I choose "Video" option from appellant's hearing channel
    And I choose "Yes" is po office attending
    And I amend the reason for update
    Then the case should be in "Ready to list" state

    When I click on Hearings tab
    Then the hearing status should be updated to "UPDATE REQUESTED"