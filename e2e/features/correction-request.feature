@posthearing @nightly-test
Feature: Correction Request
  Background:
    Given I presetup an "SANDLDLA" SYA case
    And I am signed in as a Case Officer
    And I navigate to an existing case
    And the case should be in "With FTA" state

    #When I switch to be a DWPResponse Writer
    #And I navigate to an existing case
    And I choose "Upload response" 
    And I respond to the appeal with upload contains further information "No" option and "EI" issue code

    # When I choose "Write final decision"
    # And I write a final decision generate notice yes daily living mobility is yes face to face

  # Scenario: Correction Request - Header Correction Upload
  #   #Given I am signed in as a Judge
  #   #And I navigate to an existing case
  #   When I choose "Write final decision"
  #   And I choose manual upload
  #   And I see "Draft Decision Notice"

  #   When I choose "Issue final decision"
  #   And I issue a final decision generate decision no
  #   Then the case should be in "Dormant" appeal status
  #   And I see "Final Decision Notice"

  #   Given I choose 'Post Hearing Request'
  #   And I upload correction request
  #   Then the case should be in "Post Hearing" state
  #   And I see "Correction application"
  #   And I see field "Event" with value "Correction Request" in "History" tab
  #   And the interloc state should be in "Awaiting Admin Action"
    
  #   #TODO sign as clerk
  #   When I choose "Admin - action correction"
  #   And I select "Header correction" and submit
  #   And I upload header correction
  #   And submit the event
  #   Then I see field "Event" with value "Admin Correction Header" in "History" tab
  #   And the case should be in "Dormant" appeal status
  #   And I see "Corrected decision notice"
  #   And the interloc state should be in "N/A"
    
  Scenario: Correction request - Body Correction
    #Given I am signed in as a Judge
    #And I navigate to an existing case
    When I choose "Write final decision"
    And I choose manual upload
    And I see "Draft Decision Notice"

    When I choose "Issue final decision"
    And I issue a final decision generate decision no
    Then the case should be in "Dormant" appeal status
    And I see "Final Decision Notice"

    Given I choose 'Post Hearing Request'
    And I upload correction request
    Then the case should be in "Post Hearing" state
    And I see "Correction application"
    And I see field "Event" with value "Correction Request" in "History" tab
    And the interloc state should be in "Awaiting Admin Action"

    When I choose "Admin - action correction"
    And I select "Body correction - Send to Judge" and submit
    And submit the event

    Then I see field "Event" with value "Correction Sent to Judge" in "History" tab
    And the case should be in "Post Hearing" appeal status
    And I see "Corrected decision notice"
    And the interloc state should be in "Review by Judge"
    And the system sends a notification to the judge informing them of the correction request
    # correction_adminCorrectionType-bodyCorrection

    # radiobutton = adminCorrectionType-headerCorrection  correction_adminCorrectionType-headerCorrection
    # submit the event 2 times continue and submit
    # history/event 	Dormant and document Corrected decision notice issued on 17-10-2023.pdf / Corrected decision notice
    # And determines that it is for a header correction
    # Then the clerk selects the "Header correction" option and clicks Continue
    # And the clerk sees the summary page
    # When the clerk reviews the summary and clicks Continue
    # Then the system generates a new decision document with the corrected header
    # And the system issues the corrected decision document to all parties as notice
    # And the system adds the corrected decision document to the documents tabs
    # And the system sets the case status to Dormant
    # And the system sets the FTA state to Corrected decision notice issued
    # And the system clears the review state

  # Scenario: Correction Request - Header Correction (Upload)
  #   Given a correction request has been submitted for a decision notice on the case on behalf of a client
  #   And the case is at a post-hearing state or dormant state
  #   And the original decision document was uploaded
  #   When the clerk reviews the correction request
  #   And determines that it is for a header correction
  #   Then the clerk selects the "Header correction" option and clicks Continue
  #   And the system navigates the clerk to the upload page
  #   When the clerk uploads the corrected decision document 
  #   And clicks Continue
  #   Then the system issues the corrected decision document to all parties
  #   And the system adds the corrected decision document to the case files
  #   And the system sets the case status to Dormant
  #   And the system sets the FTA state to Corrected decision notice issued
  #   And the system clears the review state
	
  # Scenario: Correction Request - Body Correction for Judge Review
  #   Given a correction request has been submitted for a decision notice on the case on behalf of a client
  #   And the case is at a post-hearing state or dormant state
  #   And the original decision document was generated
  #   When the clerk reviews the correction request
  #   And determines that it is for a body correction
  #   Then the clerk selects the "Body correction - Send to Judge" option and clicks Continue  #correction_adminCorrectionType-bodyCorrection
  # click and submit
  # Interlocutory review state / Review by Judge  and state is 	Post Hearing
  #   And the system sets the review state to Interloc - Send to Judge
  #   And the system ensures that the case status is Post Hearing
  #   And the system sends a notification to the judge informing them of the correction request
	
  # Scenario: Salaried Judge Corrects Decision Notice
  #   Given a salaried judge receives a correction request for a final decision notice that they issued
  #   When the judge selects the "Write final decision" option from the next steps menu
  #   Then the system navigates the judge to the "Write final decision" screens
  #   And the judge adds new text to the top of the page stating "You are now correcting a decision notice."
  #   And the judge completes the necessary fields and clicks Continue
  #   And the system generates a draft corrected final decision notice
  #   And the system navigates the judge to the preview screen
  #   When the judge previews the corrected decision notice and makes any necessary changes
  #   And the judge clicks Issue final decision
  #   Then the system issues the corrected final decision notice to all parties
  #   And the system updates the FTA state to Correction granted
  #   And the system updates the case status to Dormant
  #   And the system clears the review state
  #   And the system adds the event Correction granted to the case


  # Scenario: when notice is uploaded you need to upload correction
  # writeFinalDecisionPreviewDocument  <-- input for upload

	