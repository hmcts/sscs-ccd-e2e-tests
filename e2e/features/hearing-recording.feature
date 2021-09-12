@hearing-recording
Feature: Upload hearing recording

  Background:
    Given I presetup an "PIP" SYA case
    When I switch to be a Case Officer
    And I navigate to an existing case
    When I choose "Add a hearing"
    And I book a hearing
    And I choose "Hearing booked"
    And I submit "Hearing booked"
    Then the case should end in "Hearing" state

  @hearing-recording
  Scenario: Should upload and Process hearing recordings
    And I choose "Upload hearing recording"
    When I select a hearing
    And I upload a hearing recording
    Then the hearing recording should be in "Hearing Recordings" tab
    And the upload hearing recording should be successfully listed in "History" tab

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose "Process hearing recording"
    And I request for Hearing recording

    When I switch to be a Case Officer
    And I navigate to an existing case
    And the hearing recording should be in "Unprocessed correspondence" tab
    And I choose "Process hearing recording"
    And I grant request for Hearing recording

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And the hearing recording should be in "Documents" tab



