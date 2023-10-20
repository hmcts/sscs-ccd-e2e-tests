@posthearing @nightly-test
Feature: Liberty To Apply
  Background:
    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    # When I switch to be a DWPResponse Writer
    # And I navigate to an existing case
    And I choose "Upload response" 
    And I respond to the appeal with upload contains further information "No" option and "EI" issue code

    # When I switch to be a Judge
    # And I navigate to an existing case
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
    And I choose "Post Hearing Request"
    And I select "Liberty to Apply" and continue
    And I select "Upload request" and continue
    And I upload a pdf file
    And submit the event
    And submit the event
    And I see "Liberty to Apply application"
  
  Scenario: Generate Liberty to Apply Request Document
    Given I am signed in as a DWPResponse Writer
    And I navigate to an existing case
    And I choose "Post Hearing Request"
    And I select "Liberty to Apply" and continue
    And I select "Enter request details"
    And I fill "Liberty to Apply" reasons with "reasons for liberty to apply"
    And I click "Continue"
    And submit the event
    And submit the event
    And I see "Liberty to Apply application"

  Scenario: Submitting a Valid Liberty to Apply Request
    # Given I am signed in as a Case Officer
    # And I navigate to an existing case
    And I choose 'Action further evidence'
    And I fill the further evidence form with "sendToInterlocReviewByJudge" and "Liberty to Apply application"
    Then the case should be in "Post Hearing" appeal status
    And the interloc state should be in "Review by Judge"
    And FTA State should be set to "Final decision issued"
    And I see "Liberty to Apply application"

  Scenario: Submitting a Valid Liberty to Apply Request from FTA
    # Given I am signed in as a Case Officer
    # And I navigate to an existing case
    And I choose 'Action further evidence'
    And I fill the further evidence form with "sendToInterlocReviewByJudge" and "Liberty to Apply application" and "FTA" as sender
    Then the case should be in "Post Hearing" appeal status
    And the interloc state should be in "Review by Judge"
    And FTA State should be set to "Liberty to Apply requested"
    And I see "Liberty to Apply application"
