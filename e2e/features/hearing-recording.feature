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
  Scenario: Upload and Action hearing recordings
    When I choose "Upload hearing recording"
    And I select a hearing
    And I upload a hearing recording
    Then the hearing recording should be in "Hearing Recordings" tab
    And the "Upload hearing recording" should be successfully listed in "History" tab

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    And I choose "DWP Request hearing recording"
    And I request for Hearing recording

    When I switch to be a Case Officer
    And I navigate to an existing case
    And I choose "Action hearing recording req"
    And I grant request for Hearing recording
    Then the "DWP Request hearing recording" should be successfully listed in "History" tab
    Then the "Action hearing recording req" should be successfully listed in "History" tab

    When I switch to be a DWPResponse Writer
    And I navigate to an existing case
    Then the hearing recording should be in "Documents" tab
