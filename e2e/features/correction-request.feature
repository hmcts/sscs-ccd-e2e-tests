@posthearing @nightly-test
Feature: Correction Request
  Background:
    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose "Upload response" 
    And I respond to the appeal with upload contains further information "No" option and "EI" issue code

    # When I choose "Write final decision"
    # And I write a final decision generate notice yes daily living mobility is yes face to face

  Scenario: Correction Request - Header Correction Upload
    Given I am signed in as a Judge
    And I navigate to an existing case
    When I choose "Write final decision"
    And I choose manual upload
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status
    And I see "Final Decision Notice"

    Given I am signed in as a Case Officer
    And I navigate to an existing case
    And I choose 'Post Hearing Request'
    And I upload correction request
    Then the case should be in "Post Hearing" state
    And I see "Correction application"
    And I see field "Event" with value "Correction Request" in "History" tab
    And the interloc state should be in "Awaiting Admin Action"
    
    Given I am signed in as a Case Officer
    And I choose "Admin - action correction"
    And I select "Header correction" and submit
    And I upload header correction
    And submit the event

    Then I see field "Event" with value "Admin Correction Header" in "History" tab
    And the case should be in "Dormant" appeal status
    And I see "Corrected decision notice"
    And the interloc state should be in "N/A"

  Scenario: Correction request - Body Correction
    Given I am signed in as a Judge
    And I navigate to an existing case
    When I choose "Write final decision"
    And I choose manual upload
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status
    And I see "Final Decision Notice"

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose 'Post Hearing Request'
    And I upload correction request
    Then the case should be in "Post Hearing" state
    And I see "Correction application"
    And I see field "Event" with value "Correction Request" in "History" tab
    And the interloc state should be in "Awaiting Admin Action"

    Given I am signed in as a Case Officer
    And I choose "Admin - action correction"
    And I select "Body correction - Send to Judge" and submit
    And submit the event

    Then I see field "Event" with value "Correction Sent to Judge" in "History" tab
    And the case should be in "Post Hearing" appeal status
    And I see "Corrected decision notice"
    And the interloc state should be in "Review by Judge"
	
  Scenario: Salaried Judge Corrects Decision Notice
    Given I am signed in as a Judge
    And  I navigate to an existing case
    And I choose "Write final decision"
    And I write a final decision yes to generate notice
    And I choose "Issue final decision"
    And I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status
    And I see "Final Decision Notice"

    Given I am signed in as a Case Officer
    And I navigate to an existing case
    And I choose 'Post Hearing Request'
    And I upload correction request
    Then the case should be in "Post Hearing" state
    And I see "Correction application"
    And I see field "Event" with value "Correction Request" in "History" tab
    And the interloc state should be in "Awaiting Admin Action"
    And I choose "Admin - action correction"
    And I select "Body correction - Send to Judge" and submit
    And submit the event

    Then I see field "Event" with value "Correction Sent to Judge" in "History" tab
    And the case should be in "Post Hearing" appeal status
    And I see field "Event" with value "Correction Sent to Judge" in "History" tab
    And the interloc state should be in "Review by Judge"

    # Given I am signed in as a Judge
    # And I navigate to an existing case
    And I choose "Write final decision"

    And I write a final decision correction and submit
    And I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status
    And I see "Final Decision Notice"
    And I see "Corrected Final Decision Notice"
    And the interloc state should be in "N/A"
    And I see field "Event" with value "Correction Granted" in "History" tab
    And FTA State should be set to "Correction Granted"
