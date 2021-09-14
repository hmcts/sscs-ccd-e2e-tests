@hearing-recording
Feature: Upload hearing recording

  Background:
    Given I presetup an "PIP" SYA case
    When I switch to be a Case Officer
    And I navigate to an existing case
    Then the case should end in "Hearing" state

  @hearing-recording
  Scenario: Process hearing recordings
    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose "DWP Request hearing recording"
    And I request for Hearing recording

    When I switch to be a Case Officer
    And I navigate to an existing case
    And I choose "Process hearing recording"
    And I grant request for Hearing recording
    Then the "DWP Request hearing recording" should be successfully listed in "History" tab
    Then the "Process hearing recording" should be successfully listed in "History" tab

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    Then the hearing recording should be in "Documents" tab
