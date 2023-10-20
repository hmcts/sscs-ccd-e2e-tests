@posthearing @nightly-test
Feature: Set Aside
  Background:
    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose "Upload response" 
    And I respond to the appeal with upload contains further information "No" option and "EI" issue code

    When I switch to be a Judge
    And I navigate to an existing case
    When I choose "Write final decision"
    And I choose manual upload
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status
    And I see "Final Decision Notice"

  Scenario: Add Uploaded Document to Documents Tab
    Given I am signed in as a DWPResponse Writer
    And I navigate to an existing case
    When I choose "Post Hearing Request"
    And I select "Set Aside" and continue
    And I select "Upload request" and continue
    And I upload a pdf file
    And submit the event
    And submit the event
    And I see "Set aside application"

  Scenario: Generate Set aside Request Document
    Given I am signed in as a DWPResponse Writer
    And I navigate to an existing case
    And I choose "Post Hearing Request"
    And I select "Set Aside" and continue
    And I select "Enter request details"
    And I fill "Set aside" reasons with "reasons for set aside"
    And I click "Continue"
    And submit the event
    And submit the event

    Then the case should be in "Post Hearing" appeal status
    And the interloc state should be in "Awaiting Admin Action"
    And FTA State should be set to "Set Aside Requested"
    And I see "Set aside"

  Scenario: Judge Handles Set Aside Application - Refused
    Given I am signed in as a Judge
    And I navigate to an existing case
    And I choose "Review Post Hearing App"
    And I select "Set Aside" and continue
    And I fill the form with "refuse" and "No" for send to judge and "No" for notice generation
    And I click "Continue"
    And I upload a post hearing request pdf file
    And submit the event
    And I see "Set aside refused decision notice"
