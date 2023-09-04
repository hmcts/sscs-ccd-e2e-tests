@nightly-test
Feature: Create Schedule and Listing
  Scenario: Auto request a Hearing for DLA case
    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And  I respond to the appeal with upload contains further information "No" option and "EI" issue code
    Then the case should be in "Ready to list" state

    And I should see a hearing request generated for the appeal
    When I click on hearing details
    Then the venue of the hearing should be in "CARDIFF SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL"
    And the duration of the hearing should be "1 hour(s) and 30 minute(s)"
    And the earliest hearing date should be from "28" days of hearing requested

  @nightly-test
  Scenario: Auto request a Hearing for PIP case
   Given I presetup an "SANDLUCVIDEO" SYA case
   And  I am signed in as a Case Officer
   And I navigate to an existing case
   Then the case should be in "With FTA" state

    And I choose "Upload response"
    And I upload UC further information with disputed General disputed by others No and further info No
    Then the case should be in "Ready to list" state

    And I should see a hearing request generated for the appeal
    When I click on hearing details
    Then the venue of the hearing should be in "CARDIFF SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL"
    And the duration of the hearing should be "1 hour(s) and 30 minute(s)"
    And the earliest hearing date should be from "28" days of hearing requested

  @nightly-test
  Scenario: Auto request a Hearing for PIP with Rep and paper hearing

    Given I presetup an "SANDLPIPREP" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the appeal with upload contains further information "No" option and "ML" issue code
    Then the case should be in "Ready to list" state

    And I should see a hearing request generated for the appeal
    When I click on hearing details
    Then the venue of the hearing should be in "CARDIFF SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL"
    And the duration of the hearing should be "1 hour(s) and 30 minute(s)"
    And the earliest hearing date should be from "28" days of hearing requested

  @nightly-test
  Scenario: Auto request a Hearing for PIP with Rep and F2F hearing

    Given I presetup an "SANDLPIPREPF2F" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    When I choose "Upload response"
    And I respond to the appeal with upload contains further information "No" option and "ML" issue code
    Then the case should be in "Ready to list" state

    And I should see a hearing request generated for the appeal
    When I click on hearing details
    Then the venue of the hearing should be in "CARDIFF SOCIAL SECURITY AND CHILD SUPPORT TRIBUNAL"
    And the duration of the hearing should be "1 hour(s) and 30 minute(s)"
    And the earliest hearing date should be from "28" days of hearing requested


