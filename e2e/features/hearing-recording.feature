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

  @hearing-recording
  Scenario: Should display recordings in Hearing Recordings tab
    Then the case should end in "Hearing" state

